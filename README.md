# STYLE

我的前端项目通用样式规范。React / Preact + Vite + Tailwind CSS v4，手机竖屏优先，深色模式必须跟随系统。

这不是组件库，也不是设计系统 —— 是一份**可直接执行、可被脚本检查**的约定：颜色只能用哪几族、间距圆角用哪几档、输入框/卡片/弹窗/toast 长什么样，一处定义、全项目复用。

## 目录

```
STYLE.md                通用样式规范（唯一权威）
templates/
  ui.tsx                共享组件模板 → 复制到 src/components/ui.tsx
  style.css             入口样式模板 → 复制到 src/style.css
scripts/
  check-style.sh        规范检查脚本（CI / 提交前跑）
README.md               本文档：怎么用、怎么改
```

## 三步接入新项目

```bash
# 1. 拉规范（或直接复制 STYLE.md 进项目根）
git clone git@github.com:Kailoinf/STYLE.git /tmp/STYLE

# 2. 复制模板
cp /tmp/STYLE/templates/ui.tsx   src/components/ui.tsx
cp /tmp/STYLE/templates/style.css src/style.css

# 3. 复制规范本体，项目特有的约定追加到文件末尾「项目差异」一节
cp /tmp/STYLE/STYLE.md STYLE.md
```

然后在 `AGENTS.md` / `CLAUDE.md` 里加一句硬约束，人和 AI 协作者都照此执行：

```markdown
## 样式规范

样式规范以 **STYLE.md 为唯一权威**：只用 Tailwind utility class、只用默认色板
（slate/sky/emerald/rose）、所有颜色必须带 `dark:` 变体、输入框统一用 `INPUT` 常量、
容器复用 `Card`/`SmallBtn`、反馈一律 toast。提交前跑 `scripts/check-style.sh`。
```

## 接入已有项目

1. `scripts/check-style.sh <项目目录>` 跑一遍，先清掉 ❌ 类问题：自定义 CSS、inline style、非默认色板、缺 `dark:` 变体。
2. 把重复的卡片/按钮/输入框结构收敛进 `src/components/ui.tsx`，页面改成复用。
3. 项目 `STYLE.md` 瘦身为「引用通用规范 + 项目差异」，不再重复抄一遍通用部分。

## 继承规则

- 通用规范是**基线**，项目 `STYLE.md` 只写差异。
- 项目规范**可以加严**（例：某项目要求所有金额右对齐），**不得放宽** STYLE.md 第 1 节的四条硬性约束。
- 出现冲突时以 `STYLE.md` 为准；确实需要破例，就把破例理由写进项目 `STYLE.md`，别让规范悄悄失效。

## 检查脚本

```bash
scripts/check-style.sh                # 检查当前目录
scripts/check-style.sh ~/proj/foo     # 检查指定项目
```

| 级别 | 检查项 |
|------|--------|
| ❌ FAIL | `src/style.css` 里有 `@import` 与滚动条隐藏之外的 CSS |
| ❌ FAIL | 源码出现 inline style（`style={{`） |
| ❌ FAIL | 出现默认色板之外的 Tailwind 颜色族 |
| ⚠️ WARN | 颜色没配 `dark:` 变体（实心主色按钮、遮罩可豁免，看行内容判断） |
| ⚠️ WARN | 手写输入框样式（疑似绕过 `INPUT`） |
| ⚠️ WARN | 源码里出现 emoji |

退出码非 0 表示有 FAIL。脚本是正则启发式，误报时看行内容判断，不要把期望值改成通过。

## 规范来源

从两个已上线项目的实际实现里提炼，不是凭空写的建议：

| 项目 | 贡献 |
|------|------|
| [salary-calc](https://github.com/Kailoinf/salary-calc) | 色板映射、`INPUT` 常量、`Card`/`Field`/`SmallBtn`、弹窗与 portal 层级、金额整数分 |
| [Car](https://github.com/Kailoinf/Car)（car-preact） | `dark:` 全量变体、toast 语义色与时长的防抖约定、手机优先容器宽度、`pnpm build && pnpm test` 提交前门禁 |

## 变更

改规范前先确认：这个规则在**至少一个真实项目**里能执行，并且能用 `check-style.sh` 或肉眼一眼验证。改完同步两个来源项目的 `STYLE.md`，不要只改这里。