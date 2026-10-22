# 前端项目样式规范（通用）

> 适用范围：**React / Preact + Vite + Tailwind CSS v4 + TypeScript** 的纯静态前端项目。
> 本文件是通用基线，任何项目都应遵守；项目自己的 `STYLE.md` = 引用本规范 + 只写项目特有的差异。
> **项目规范可以加严，不得放宽本文的「硬性约束」**（第 1 节）。
> 逐条取自 salary-calc、car-preact 两个项目的实际实现，不是建议性指南。

---

## 1. 硬性约束（不可违背）

1. **样式全部用 Tailwind utility class**
   - `src/style.css` 只允许 `@import "tailwindcss"` 与全局隐藏滚动条，**不写自定义 CSS**。
   - 禁止 inline style（`style={{...}}`）。
2. **只用 Tailwind 默认色板，且只用四族**：`slate`（中性）、`sky`（可操作）、`emerald`（成功/正向）、`rose`（失败/危险），外加 `white` / `black` / `transparent`。
   - 不自定义颜色、不加 `@theme` 变量、不引入新的十六进制色值。
3. **颜色必须在深色模式下仍然可读**：浅色底、文字、边框一律配 `dark:` 变体（`white` / `black` / 遮罩 `bg-black/50` 除外）。
   - 豁免的只有实心主色面：`bg-sky-600` / `bg-rose-600` 配 `text-white` 的主/危险按钮，深浅两色下同一观感。
   - 深色底色一律 `dark:bg-black`（OLED 纯黑），不用 `dark:bg-slate-900`。
4. **共享组件与样式常量只有一份**：`src/components/ui.tsx` 的 `Card` / `SmallBtn` / `Field` / `INPUT`。
   - 页面里不得重写等价结构，不得另起一套按钮或输入框样式。

---

## 2. 颜色

| 用途 | light | dark |
|------|-------|------|
| 页面外壳背景 | `bg-white` | `dark:bg-black` |
| 页面外壳文字 | `text-slate-800` | `dark:text-slate-100` |
| 卡片 / 弹窗背景 | `bg-white` | `dark:bg-black` |
| 标题文字 | `text-slate-900` | `dark:text-slate-100` |
| 正文文字 | `text-slate-700` \| `text-slate-800` | `dark:text-slate-200` \| `dark:text-slate-300` |
| 次要 / 说明文字 | `text-slate-500` \| `text-slate-600` | `dark:text-slate-400` |
| 更弱的辅助文字（备案号等） | `text-slate-300` | `dark:text-slate-600` |
| 强调 / 主操作 | `bg-sky-600` `border-sky-600` `text-sky-600` | `dark:text-sky-400` `dark:border-sky-800` |
| 聚焦环 | `focus:border-sky-500` `focus:ring-sky-500` | `dark:focus:border-sky-400` `dark:focus:ring-sky-400` |
| 成功 / 正向金额 | `text-emerald-600` `border-emerald-300` `bg-emerald-50` | `dark:text-emerald-400` `dark:border-emerald-700` |
| 失败 / 危险 / 负向金额 | `text-rose-500` `border-rose-300` `bg-rose-600` | `dark:text-rose-400` `dark:border-rose-700` |
| 中性提示 | `slate` 系列 | 同族加深 |
| 边框 / 分割线 | `border-slate-200` \| `border-slate-300` | `dark:border-slate-700` \| `dark:border-slate-600` |
| 遮罩 | `bg-black/50`（确认类浮层 `bg-black/60`） | 同值，不加 dark 变体 |

- 语义固定，不随大小事：`sky`=可操作、`emerald`=成功/收入、`rose`=失败/扣款/危险、`slate`=中性。
- 若某项目确有品牌色需求，在**项目 STYLE.md** 里登记唯一色值并配好 dark 变体，通用规范不预留位置。
- 颜色不能是唯一信息载体：金额/状态变化要同时有文字或符号（如 `-`、`✓`）。

---

## 3. 排版

| 元素 | class |
|------|-------|
| 页面主标题 `h1` | `text-2xl font-bold text-slate-900 dark:text-slate-100` |
| 卡片标题 `h2` | `font-semibold text-slate-900 dark:text-slate-100` |
| 区块小标题 `h3` | `text-sm font-medium text-slate-700 dark:text-slate-300` |
| 正文 / 表单 / 表格 | `text-sm` |
| 说明、辅助、页脚 | `text-xs text-slate-500 dark:text-slate-400` |
| 大数字展示（车牌、金额） | `text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100` |

- **所有数字与金额必须 `tabular-nums`**（对齐、防跳动）。
- 长文本防溢出：容器 `min-w-0`，文本 `break-all`；需要复制的值加 `select-all`。
- 不使用自定义字体 utility（`font-[...]`）；字体栈用 Tailwind 默认。仅在 canvas 绘制等非 DOM 场景手写字体栈（`"Inter","Noto Sans SC",system-ui,sans-serif`）。
- 界面文案：**简体中文、不带 emoji**；错误提示必须给出下一步动作（例：「服务器错误，请使用其他方式联系」），不暴露内部实现名词。

---

## 4. 布局与间距

```tsx
// 页面外壳
<div className="min-h-screen bg-white dark:bg-black text-slate-800 dark:text-slate-100">
  <div className="mx-auto max-w-lg px-4 py-6 space-y-5">  {/* 手机优先 */}
```

| 用途 | class |
|------|-------|
| 页面外壳 | `min-h-screen bg-white dark:bg-black text-slate-800 dark:text-slate-100` |
| 容器 | `mx-auto px-4 py-6 space-y-5` |
| 容器宽度 | 手机优先 `max-w-lg`；多卡片工具型桌面也看 `max-w-4xl` |
| 卡片内间距 | `space-y-3` + `p-4` |
| 表单网格 | `grid grid-cols-2 sm:grid-cols-4 gap-3` |
| 区块分隔 | `border-t border-slate-200 dark:border-slate-700 pt-4` |

- 间距只用 `space-y-*` / `gap-*` 控制，不用单点 `mt-*` 微调（区块间补偿 `pt-*` 除外）。
- **手机竖屏优先**：断点只用 `sm:` / `md:`；任何改动都要在窄屏（375px）下检查一遍。

---

## 5. 圆角、边框、阴影

| 元素 | class |
|------|-------|
| 卡片 / 弹窗 | `rounded-xl` |
| 按钮 / toast | `rounded-lg` |
| 输入框 / select | `rounded-md` |
| checkbox | `rounded` |
| 标签（pill） | `rounded-full` |

- **分隔靠边框，不靠阴影**：卡片 `border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none`。
- `shadow-xl` 只出现在浮层（弹窗内卡、toast）。
- 不使用渐变、不使用彩色阴影。

---

## 6. 组件复用（`src/components/ui.tsx`）

`ui.tsx` 只放**无业务语义**的通用样式；业务组件放 `src/components/*.tsx`。

```tsx
/** 输入框统一样式（见 STYLE.md） */
export const INPUT =
  "px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-black text-sm focus:border-sky-500 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 w-full";

/** 白色圆角分区卡片，可带右上角操作按钮 */
export function Card({ title, action, children }) {
  return (
    <section className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm dark:shadow-none space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** 卡片右上角 / 行内小按钮（button 或 a） */
export function SmallBtn({ onClick, href, children }) {
  const cls =
    "text-xs px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-black transition-colors";
  return href
    ? <a href={href} className={cls}>{children}</a>
    : <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** 通用输入字段：label + 任意 input/select 子元素 */
export function Field({ label, className, children }) {
  return (
    <label className={"flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400" + (className ? " " + className : "")}>
      {label}
      {children}
    </label>
  );
}
```

- **同类结构出现第二次就抽进 `ui.tsx`**，不要复制粘贴。
- 新增共享组件前先看 `ui.tsx` 是否已有等价物。
- 标签 pill：`text-xs bg-sky-50 dark:bg-black text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-full border border-sky-100 dark:border-sky-800`。
- 可直接落地的模板见本仓库 [`templates/ui.tsx`](templates/ui.tsx)（含 `Modal` / `Toast`）。

---

## 7. 按钮

| 类型 | class |
|------|-------|
| 主操作（卡片内） | `w-full px-4 py-3 rounded-lg bg-sky-600 border border-sky-600 text-white text-base font-medium transition-colors active:bg-sky-700` |
| 主操作（弹窗底部、小） | `px-4 py-2 rounded-lg bg-sky-600 border border-sky-600 text-white text-sm font-medium` |
| 次操作 | `px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-black transition-colors` |
| 危险操作 | `px-4 py-2 rounded-lg bg-rose-600 border border-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors` |
| 危险小按钮 | `text-xs px-2 py-1 rounded-md border border-rose-300 dark:border-rose-800 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-black transition-colors` |
| 右上角小按钮 | `SmallBtn`（见第 6 节） |

- **位置**：卡片内的操作按钮放**卡片标题右上角**（`Card` 的 `action` 槽 / `SmallBtn`），不悬浮、不用 FAB。
- **状态不抖**：hover/active 只改颜色，`transition-colors`；不出现边框宽度或尺寸变化、不用「选中加粗边框」那类会顶动布局的写法。
- 非提交用途的按钮一律 `type="button"`。
- 危险操作必须二次确认（确认弹窗），确认按钮才是 `rose`。

---

## 8. 表单

- 输入框 / select 一律用 `INPUT` 常量；**页面里不手写输入框 className**。
- 用 `<label>` 包裹控件（`flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400`）或 `Field` 组件。
- **失焦才提交**：聚焦期间用本地 draft 显示，`onBlur` 校验并写回全局状态，避免输入被打断；非法输入回滚不报错。
- 数值以**整数**存储（金额一律「分」），显示层格式化，解析集中在一个 util（如 `yuanToCents`），不在组件里散落换算。
- checkbox：`inline-flex items-center gap-1.5` + `rounded`。
- 禁用态降级文字色（`disabled:text-slate-300 dark:disabled:text-slate-600`），不直接隐藏控件。

---

## 9. 弹窗（Modal）

```tsx
<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
  <div className="flex min-h-full items-center justify-center">
    <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xl w-full max-w-md space-y-3">
      ...
    </div>
  </div>
</div>
```

- 宽度档位：确认类 `max-w-sm`、单列表单 `max-w-md`、多字段设置 `max-w-xl`。
- 层级：普通浮层 `z-50`；**从已打开的浮层里再开的确认框**用 `z-[60]` + `createPortal` 到 `document.body`（React 用 `react-dom`，Preact 用 `preact/compat`），避免被父层 `overflow` / 堆叠上下文裁剪。
- 打开期间锁页面滚动：`document.body.style.overflow = "hidden"`，关闭时还原原值。
- 关闭以显式按钮为准（「完成」/「取消」），不依赖点遮罩关闭。
- 内容超高时可滚动（`overflow-y-auto` + `flex min-h-full items-center`），不裁切。

---

## 10. Toast 反馈

- **所有反馈走 toast，不把反馈文字内嵌进卡片或页面**；不用 `alert()` / `confirm()`。

```tsx
{toast && (
  <div key={toast.id} role="status" aria-live="polite"
       className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]">
    <div className={"px-4 py-2.5 rounded-lg border bg-white dark:bg-black shadow-xl text-sm font-medium " + TOAST_STYLE[toast.kind]}>
      {toast.text}
    </div>
  </div>
)}
```

| kind | 语义色 | 时长 |
|------|--------|------|
| `ok` | `border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400` | 30s |
| `err` | `border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400` | 30s |
| `warn` | `border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300` | 3s |

- 常量集中在 `TOAST_MS` / `TOAST_STYLE`，不在调用点散写。
- 必带 `role="status"` + `aria-live="polite"`；用 `key`（时间戳）让重复提示重新挂载。
- 防抖：同一动作飞行中的重复点击静默去重（`inflight` ref）；冷却类限制在**真正触发时**检查，不倒计时、不改按钮样式、不在点击前禁用按钮。

---

## 11. 无障碍

- 焦点环不能删（保持 `focus:ring-*`），键盘可达。
- 只有图标的按钮要有可读文字或 `aria-label`。
- 表单控件与 label 关联（`<label>` 包裹即可）。
- 颜色之外必须有文字/符号承载状态信息（见第 2 节）。
- 装饰性图片 `alt` 写用途或留空，功能图标必须写 `alt`。

---

## 12. 禁止事项

- ❌ 在 `style.css` 里写自定义 CSS（全局滚动条隐藏除外）
- ❌ inline style / `style={{...}}`
- ❌ 引入新颜色值 —— 只用 Tailwind 默认 `slate` / `sky` / `emerald` / `rose`（+ `white` / `black` / `transparent`）
- ❌ 浅色底 / 文字 / 边框只在 light 下定义、不写 `dark:` 变体（实心主色面与遮罩除外）
- ❌ 页面手写输入框 className（绕过 `INPUT`）
- ❌ 自建与 `ui.tsx` 等价的 Card / 按钮 / Field 结构
- ❌ 引入 UI 组件库（antd / MUI / shadcn …）或 CSS-in-JS 运行时
- ❌ 界面出现 emoji
- ❌ 反馈内嵌卡片、用 `alert()` / `confirm()`
- ❌ hover / active 改边框宽度或尺寸（抖动）
- ❌ 为过检查而放宽本文约束 —— 规范冲突时以本文为准

---

## 13. 落地流程

**新项目**

1. 复制本文件为项目根 `STYLE.md`，把项目特有约定追加到末尾「项目差异」一节（可加严，不可放宽第 1 节）。
2. 复制 `templates/ui.tsx` → `src/components/ui.tsx`，`templates/style.css` → `src/style.css`。
3. 在 `AGENTS.md` / `CLAUDE.md` 里写一句硬约束：**样式规范以 `STYLE.md` 为唯一权威**（并列出可检查项），让 AI 协作者和人都照此执行。
4. 提交前跑一次 `scripts/check-style.sh <项目目录>`。

**已有项目接入**

1. 先跑 `scripts/check-style.sh`，把 ❌ 类问题清零（自定义 CSS、inline style、非默认色板、缺 `dark:`）。
2. 再把重复结构收敛进 `src/components/ui.tsx`，页面改为复用。
3. 最后把项目 `STYLE.md` 改成「引用本通用规范 + 项目差异」的短文件。

---

## 14. 提交前自查

- [ ] `style.css` 只有 `@import "tailwindcss"` 和滚动条隐藏
- [ ] 没有 `style={{...}}`
- [ ] 色板只有 `slate` / `sky` / `emerald` / `rose` / `white` / `black`
- [ ] 浅色底 / 文字 / 边框都带 `dark:` 变体（实心主色面除外）
- [ ] 输入框都用 `INPUT`，select 同款
- [ ] 卡片都用 `Card`，右上角操作都用 `SmallBtn`
- [ ] 反馈都走 toast，带 `role="status"`
- [ ] 弹窗用了对的 `max-w` 档位、`z-index` 与滚动锁定
- [ ] 数字都 `tabular-nums`
- [ ] 375px 窄屏下无横向溢出
- [ ] 界面无 emoji
- [ ] `scripts/check-style.sh` 通过