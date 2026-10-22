/**
 * 共享 UI 组件模板 —— 复制为 src/components/ui.tsx
 *
 * 只放无业务语义的通用样式；业务组件放 src/components/*.tsx。
 *
 * 框架适配（本文件默认 Preact 11）：
 *   Preact: import { useEffect, useRef, useState } from "preact/hooks";
 *           import type { ComponentChildren } from "preact";
 *   React : import { useEffect, useRef, useState } from "react";
 *           import type { ReactNode } from "react";
 *           （把下面的 ComponentChildren 全部替换为 ReactNode）
 *
 * 样式规范见 ../STYLE.md，本文件是规范第 6/7/9/10 节的落地实现。
 */
import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
// 仅 Modal 的 portal 分支需要；框架适配：
//   Preact: import { createPortal } from "preact/compat";   （preact 自带，无额外依赖）
//   React : import { createPortal } from "react-dom";
// 若项目不使用 portal：删掉这行，并把 Modal 的 portal 分支删掉，只留内联渲染。
import { createPortal } from "preact/compat";

/** 输入框 / select 统一样式 */
export const INPUT =
  "px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-black text-sm focus:border-sky-500 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400 w-full";

/** 白色圆角分区卡片，可带右上角操作按钮 */
export function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <section className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm dark:shadow-none space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** 卡片右上角 / 行内小按钮（按钮或链接） */
export function SmallBtn({
  onClick,
  href,
  children,
}: {
  onClick?: () => void;
  href?: string;
  children: ComponentChildren;
}) {
  const cls =
    "text-xs px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-black transition-colors";
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/** 通用输入字段：label + 任意 input/select 子元素 */
export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ComponentChildren;
}) {
  return (
    <label
      className={
        "flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400" +
        (className ? " " + className : "")
      }
    >
      {label}
      {children}
    </label>
  );
}

/** 主操作按钮 */
export function PrimaryBtn({
  onClick,
  block,
  children,
}: {
  onClick: () => void;
  block?: boolean;
  children: ComponentChildren;
}) {
  const cls = block
    ? "w-full px-4 py-3 rounded-lg bg-sky-600 border border-sky-600 text-white text-base font-medium transition-colors active:bg-sky-700"
    : "px-4 py-2 rounded-lg bg-sky-600 border border-sky-600 text-white text-sm font-medium transition-colors";
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/** 次操作按钮 */
export function SecondaryBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ComponentChildren;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-black transition-colors"
    >
      {children}
    </button>
  );
}

/** 危险操作按钮（必须配合确认弹窗使用） */
export function DangerBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ComponentChildren;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-rose-600 border border-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
    >
      {children}
    </button>
  );
}

/**
 * 弹窗。确认类浮层从已打开的浮层内再开时传 portal=true：
 * 渲染到 document.body 且 z-[60]，避免被父层 overflow / 堆叠上下文裁剪。
 * React 用 react-dom 的 createPortal，Preact 用 preact/compat 的 createPortal。
 */
export function Modal({
  open,
  maxWidth = "md",
  onClose,
  portal,
  children,
}: {
  open: boolean;
  maxWidth?: "sm" | "md" | "xl";
  onClose?: () => void;
  portal?: boolean;
  children: ComponentChildren;
}) {
  // 打开期间锁页面滚动，关闭时还原原值
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const maxCls = { sm: "max-w-sm", md: "max-w-md", xl: "max-w-xl" }[maxWidth];
  const inner = (
    <div
      className={
        "fixed inset-0 overflow-y-auto bg-black/50 p-4 " +
        (portal ? "z-[60]" : "z-50")
      }
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className={
            "bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xl w-full space-y-3 " +
            maxCls
          }
        >
          {children}
          {onClose && (
            <div className="flex justify-end gap-2">
              <SecondaryBtn onClick={onClose}>完成</SecondaryBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return portal ? createPortal(inner, document.body) : inner;
}

/* ------------------------------- Toast ------------------------------- */

export type ToastKind = "ok" | "err" | "warn";
export type ToastData = { id: number; kind: ToastKind; text: string };

/** 失败/成功 30 秒，中性提醒 3 秒 */
export const TOAST_MS: Record<ToastKind, number> = {
  ok: 30_000,
  err: 30_000,
  warn: 3_000,
};

export const TOAST_STYLE: Record<ToastKind, string> = {
  ok: "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400",
  err: "border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400",
  warn: "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300",
};

/** 底部居中 toast；`show` 返回值直接挂在页面根节点末尾 */
export function Toast({ data }: { data: ToastData | null }) {
  if (!data) return null;
  return (
    <div
      key={data.id}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]"
    >
      <div
        className={
          "px-4 py-2.5 rounded-lg border bg-white dark:bg-black shadow-xl text-sm font-medium " +
          TOAST_STYLE[data.kind]
        }
      >
        {data.text}
      </div>
    </div>
  );
}

/** toast 状态与定时器；重复提示以新 id 重新挂载 */
export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (kind: ToastKind, text: string) => {
    setToast({ id: Date.now(), kind, text });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS[kind]);
  };

  return { toast, show };
}