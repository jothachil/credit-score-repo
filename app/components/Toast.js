"use client";

import { Toast } from "@base-ui/react/toast";

/**
 * Snackbar-style toasts (dark pill, white text, optional leading icon + action).
 *
 * Fire one from anywhere:
 *
 *   import { toast } from "@/app/components/Toast";
 *   toast.add({ title: "Saved" });
 *   toast.add({
 *     title: "Item deleted",
 *     data: { action: { label: "Undo", onClick: restore } },
 *   });
 *   toast.add({
 *     title: "This is a multi-line snackbar…",
 *     data: { icon: IconBell, action: { label: "Action" }, block: true },
 *   });
 *
 * `data` options:
 *   icon   — a Tabler icon component rendered before the message
 *   action — { label, onClick } shown as a brand-colored button (dismisses on tap)
 *   block  — true puts the action on its own right-aligned row (multi-line)
 *
 * Requires <ToastProvider> mounted once near the app root (see app/layout.js).
 */
export const toast = Toast.createToastManager();

function ToastAction({ id, action }) {
  if (!action) return null;
  return (
    <button
      type="button"
      onClick={() => {
        action.onClick?.();
        toast.close(id);
      }}
      className="shrink-0 text-[16px] leading-6 font-bold text-content-brand"
    >
      {action.label}
    </button>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((item) => {
    const { icon: Icon, action, block } = item.data ?? {};

    return (
      <Toast.Root
        key={item.id}
        toast={item}
        className="pointer-events-auto w-full rounded-lg bg-background-inverse-primary text-content-inverse-primary shadow-[0_12px_36px_rgba(0,0,0,0.24)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:translate-y-3 data-ending-style:opacity-0 data-starting-style:translate-y-3 data-starting-style:opacity-0"
      >
        {block
          ? <div className="flex flex-col gap-1 px-4 py-3">
              <div className="flex items-start gap-4">
                {Icon && <Icon size={24} stroke={2} className="shrink-0" />}
                <Toast.Title className="text-[14px] leading-5">
                  {item.title}
                </Toast.Title>
              </div>
              <div className="flex justify-end px-2 py-1">
                <ToastAction id={item.id} action={action} />
              </div>
            </div>
          : <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                {Icon && <Icon size={24} stroke={2} className="shrink-0" />}
                <Toast.Title className="text-[14px] leading-5">
                  {item.title}
                </Toast.Title>
              </div>
              <ToastAction id={item.id} action={action} />
            </div>}
      </Toast.Root>
    );
  });
}

export function ToastProvider({ children }) {
  return (
    <Toast.Provider toastManager={toast}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 left-1/2 z-[60] flex w-[328px] max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col-reverse gap-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
