import { Tabs, TabsList, TabsPanel, TabsTab } from "../../components/TabsField";
import SectionShell from "../SectionShell";

export default function TabsSection() {
  return (
    <SectionShell title="Tabs" description="Underline tab navigation">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="activity">Activity</TabsTab>
          <TabsTab value="account">Account</TabsTab>
        </TabsList>
        <TabsPanel value="overview" className="text-xs text-content-secondary">
          Overview content
        </TabsPanel>
        <TabsPanel value="activity" className="text-xs text-content-secondary">
          Activity content
        </TabsPanel>
        <TabsPanel value="account" className="text-xs text-content-secondary">
          Account content
        </TabsPanel>
      </Tabs>
    </SectionShell>
  );
}
