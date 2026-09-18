"use client";
import { useState } from "react";
import CampaignShell from "../components/campaignShell";
import CampaignOffcanvas from "../components/campaignOffcanvas";
import SocialKpiRow from "./socialKpiRow";
import { SocialCampaignListData } from "../../../../core/json/socialCampaignListData";
import {
  SOCIAL_CAMPAIGN_COLUMNS,
  SOCIAL_CAMPAIGN_MANAGE_COLUMNS,
  SOCIAL_CAMPAIGN_FILTERS,
  socialCampaignTabs,
} from "./socialCampaignConfig";

const SocialCampaignComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <CampaignShell
      title="Social Campaign"
      badgeCount={125}
      tabs={socialCampaignTabs("active")}
      kpis={[]}
      kpiSlot={<SocialKpiRow />}
      columns={SOCIAL_CAMPAIGN_COLUMNS}
      manageColumns={SOCIAL_CAMPAIGN_MANAGE_COLUMNS}
      data={SocialCampaignListData}
      filters={SOCIAL_CAMPAIGN_FILTERS}
      addLabel="Add New Campaign"
      addTarget="#offcanvas_add"
      searchText={searchText}
      onSearch={setSearchText}
    >
      <CampaignOffcanvas
        fields={[
          { Label: "Platform", Options: ["Choose", "Linked In", "Facebook", "Instagram", "X"] },
          { Label: "Objective", Options: ["Choose", "Lead Generation", "Brand Awareness", "Engagement"] },
        ]}
      />
    </CampaignShell>
  );
};

export default SocialCampaignComponent;
