"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";

/**
 * Underline-style tabs.
 *
 * Controlled:   <Tabs value={v} onValueChange={setV}>
 * Uncontrolled: <Tabs defaultValue="overview">
 *
 *   <TabsList>
 *     <TabsTab value="overview">Overview</TabsTab>
 *     <TabsTab value="account">Account</TabsTab>
 *   </TabsList>
 *   <TabsPanel value="overview">…</TabsPanel>
 *   <TabsPanel value="account">…</TabsPanel>
 *
 * The active tab turns brand-colored + semibold and a brand underline slides
 * beneath it. TabsList renders its own sliding indicator — just drop tabs in.
 */
export function Tabs(props) {
  return <BaseTabs.Root {...props} />;
}

export function TabsList({ className = "", children, ...props }) {
  return (
    <BaseTabs.List
      className={`relative flex border-b border-border-primary ${className}`}
      {...props}
    >
      {children}
      <BaseTabs.Indicator className="absolute bottom-0 left-0 h-[3px] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-t-full bg-background-brand transition-all duration-200 ease-in-out" />
    </BaseTabs.List>
  );
}

export function TabsTab({ className = "", ...props }) {
  return (
    <BaseTabs.Tab
      className={`relative px-4 py-3 text-[14px] leading-5 font-normal text-content-secondary outline-none transition-colors hover:text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected data-active:font-semibold data-active:text-content-brand ${className}`}
      {...props}
    />
  );
}

export function TabsPanel({ className = "", ...props }) {
  return (
    <BaseTabs.Panel
      className={`pt-4 outline-none focus-visible:outline-2 focus-visible:outline-border-selected ${className}`}
      {...props}
    />
  );
}
