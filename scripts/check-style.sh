#!/usr/bin/env bash
# 样式规范检查 —— 对应 STYLE.md 第 1 / 2 / 12 节
#
# 用法：
#   scripts/check-style.sh                 # 检查当前目录
#   scripts/check-style.sh ~/proj/foo      # 检查指定项目
#
# 退出码：有 FAIL 时为 1。脚本是正则启发式，误报请看行内容人工判断，
# 不要把期望值改成通过（那会让规范失效）。

set -uo pipefail

ROOT="${1:-.}"
SRC="$ROOT/src"

if [ ! -d "$SRC" ]; then
  echo "找不到源码目录：$SRC"
  exit 2
fi

FAILS=0
WARNS=0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fail() { printf 'FAIL  %s\n' "$1"; FAILS=$((FAILS + 1)); }
warn() { printf 'WARN  %s\n' "$1"; WARNS=$((WARNS + 1)); }
pass() { printf 'OK    %s\n' "$1"; }

# 允许的色族（STYLE.md 第 1.2 节）+ 允许的语义关键字
ALLOWED='slate|sky|emerald|rose|white|black|transparent|current|inherit'
# Tailwind 默认色板全集，用于发现“自己加的颜色”
PALETTE='slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white'
# 必须配 dark: 变体的色族（white / black / transparent 豁免）
STRICT='slate|sky|emerald|rose'
# 颜色 utility 前缀：整体加括号使用，别让 | 抢掉后面的后缀
PREFIX='ring-offset|bg|text|border|ring|from|via|to|fill|stroke|outline|divide|decoration|placeholder|accent|caret|shadow'

COLOR_RE="(${PREFIX})-(${PALETTE})(-[0-9]{2,3})?\b"
STRICT_RE="(${PREFIX})-(${STRICT})(-[0-9]{2,3})?\b"
STRIP_RE="^(${PREFIX})-"

FILES=$(find "$SRC" -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.jsx' -o -name '*.js' -o -name '*.html' \) 2>/dev/null)

echo "== 检查 $ROOT =="

# ---------------------------------------------------------------- 1. 自定义 CSS
CSS=""
[ -f "$SRC/style.css" ] && CSS="$SRC/style.css"
[ -z "$CSS" ] && CSS=$(find "$SRC" -maxdepth 1 -name '*.css' 2>/dev/null | head -1)

if [ -z "$CSS" ]; then
  warn "src/ 下没有 css 文件（规范要求入口样式只有 @import 与滚动条隐藏）"
else
  # 去掉注释/空行/@import/滚动条规则后，剩下的声明都算自定义 CSS
  grep -vE '^\s*(/\*|\*|//)?\s*$' "$CSS" \
    | grep -vE '^\s*(/\*|\*)' \
    | grep -vE '^\s*@import' \
    | grep -vE '^\s*html(::)?(-webkit-scrollbar)?\s*\{[^}]*\}\s*$' \
    | grep -vE '^\s*html(::)?(-webkit-scrollbar)?\s*\{?\s*$' \
    | grep -vE '^\s*(scrollbar-width|display|-ms-overflow-style)\s*:' \
    | grep -vE '^\s*[{}]\s*$' \
    | grep -vE '^\s*@custom-variant' \
    > "$TMP/css.txt" || true
  if [ -s "$TMP/css.txt" ]; then
    fail "$CSS 里有 @import 与滚动条隐藏之外的 CSS："
    sed 's/^/      /' "$TMP/css.txt"
  else
    pass "$CSS 只有 @import 与滚动条隐藏"
  fi
fi

# ---------------------------------------------------------------- 2. inline style
if [ -n "$FILES" ]; then
  INLINE=$(echo "$FILES" | xargs grep -nE 'style=\{\{|style="' 2>/dev/null || true)
  if [ -n "$INLINE" ]; then
    fail "出现 inline style（应用 utility class）："
    echo "$INLINE" | sed 's/^/      /' | head -20
  else
    pass "没有 inline style"
  fi
fi

# ---------------------------------------------------------------- 3. 非默认色族
if [ -n "$FILES" ]; then
  echo "$FILES" | xargs grep -rhoE "$COLOR_RE" 2>/dev/null \
    | sed -E "s/${STRIP_RE}//; s/-[0-9]{2,3}$//" \
    | sort -u \
    | grep -vxE "(${ALLOWED})" > "$TMP/palette.txt" || true
  if [ -s "$TMP/palette.txt" ]; then
    BAD=$(tr '\n' '|' < "$TMP/palette.txt" | sed 's/|$//')
    fail "用到默认四族之外的颜色（$(tr '\n' ' ' < "$TMP/palette.txt" | sed 's/ $//')）："
    echo "$FILES" | xargs grep -rnoE "$COLOR_RE" 2>/dev/null \
      | grep -E -- "-(${BAD})(-[0-9]{2,3})?$" \
      | sed 's/^/      /' | head -20
  else
    pass "颜色只用 slate / sky / emerald / rose（+ white / black）"
  fi
fi

# ---------------------------------------------------------------- 4. 缺 dark: 变体
if [ -n "$FILES" ]; then
  NODARK=$(echo "$FILES" | xargs grep -nE "$STRICT_RE" 2>/dev/null \
    | grep -v 'dark:' || true)
  if [ -n "$NODARK" ]; then
    warn "颜色没有 dark: 变体（确认深色下仍可读；实心主色按钮如 bg-sky-600 + text-white、bg-black/50 遮罩一般可豁免）："
    echo "$NODARK" | sed 's/^/      /' | head -20
  else
    pass "四族颜色都带 dark: 变体"
  fi
fi

# ---------------------------------------------------------------- 5. 绕过 INPUT 常量
if [ -n "$FILES" ]; then
  HAND=$(echo "$FILES" | xargs grep -nE '<(input|select|textarea)' 2>/dev/null \
    | grep 'className="' || true)
  if [ -n "$HAND" ]; then
    warn "疑似手写输入框样式（应使用 ui.tsx 的 INPUT 常量）："
    echo "$HAND" | sed 's/^/      /' | head -20
  else
    pass "输入框都用 INPUT 常量"
  fi
fi

# ---------------------------------------------------------------- 6. emoji
if [ -n "$FILES" ]; then
  EMOJI=$(echo "$FILES" | xargs grep -nP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{26FF}\x{2705}\x{274C}\x{2B50}\x{FE0F}]' 2>/dev/null || true)
  if [ -n "$EMOJI" ]; then
    warn "界面文案里疑似有 emoji（✓ / ✗ 等文本符号不算）："
    echo "$EMOJI" | sed 's/^/      /' | head -20
  else
    pass "没有 emoji"
  fi
fi

echo "== FAIL $FAILS / WARN $WARNS =="
[ "$FAILS" -eq 0 ] || exit 1