"use client";

import { Drawer } from "@base-ui/react/drawer";

/**
 * Bottom sheet — a drawer pinned to the bottom that swipes down to dismiss.
 *
 * Controlled:
 *   <BottomSheet open={open} onOpenChange={setOpen} title="Title">
 *     …body…
 *   </BottomSheet>
 *
 * Or with a trigger (uncontrolled):
 *   <BottomSheet trigger={<Button>Open</Button>} title="Title">…</BottomSheet>
 *
 * `title` is required for accessibility; pass `titleHidden` to keep it visually
 * hidden (the Figma sheet is a bare body slot). `description` is optional.
 */
export default function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  titleHidden = false,
  children,
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="down">
      {trigger && <Drawer.Trigger render={trigger} />}
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-background-overlay transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className="flex w-full max-w-[400px] flex-col outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)] data-swiping:select-none data-swiping:duration-0">
            {/* Dragger — decorative grip on the scrim above the white sheet.
                The popup is swipe-to-dismiss by default. */}
            <div className="flex h-12 w-full shrink-0 items-end justify-center pb-2">
              <span className="h-1 w-11 rounded-full bg-white/70" />
            </div>

            <Drawer.Content className="flex max-h-[80vh] flex-col overflow-y-auto rounded-t-2xl bg-background-primary">
              <Drawer.Title
                className={
                  titleHidden
                    ? "sr-only"
                    : "px-5 pt-8 text-xl leading-6 font-bold text-content-primary"
                }
              >
                {title}
              </Drawer.Title>
              {description && (
                <Drawer.Description className="px-5  text-xs text-content-secondary">
                  {description}
                </Drawer.Description>
              )}
              <div className="px-5 pb-5">{children}</div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
