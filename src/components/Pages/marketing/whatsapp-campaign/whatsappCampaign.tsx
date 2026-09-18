"use client";
import { useState } from "react";
import CampaignShell from "../components/campaignShell";
import WhatsappKpiRow from "./whatsappKpiRow";
import CampaignOffcanvas from "../components/campaignOffcanvas";
import { WhatsappCampaignListData } from "../../../../core/json/whatsappCampaignListData";
import {
  WHATSAPP_CAMPAIGN_COLUMNS,
  WHATSAPP_CAMPAIGN_MANAGE_COLUMNS,
  WHATSAPP_CAMPAIGN_FILTERS,
  whatsappCampaignTabs,
} from "./whatsappCampaignConfig";

const WhatsappCampaignComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <CampaignShell
      title="WhatsApp Campaign"
      badgeCount={128}
      tabs={whatsappCampaignTabs("active")}
      kpis={[]}
      kpiSlot={<WhatsappKpiRow />}
      columns={WHATSAPP_CAMPAIGN_COLUMNS}
      manageColumns={WHATSAPP_CAMPAIGN_MANAGE_COLUMNS}
      data={WhatsappCampaignListData}
      filters={WHATSAPP_CAMPAIGN_FILTERS}
      addLabel="Add New Campaign"
      addTarget="#offcanvas_add"
      searchText={searchText}
      onSearch={setSearchText}
    >
      <CampaignOffcanvas
        fields={[
          { Label: "Audience Segment", Options: ["Choose", "Active Customers", "New Signups", "Inactive Users"] },
          { Label: "Message Template", Options: ["Select", "Renewal-SMS", "Promo-SMS", "Welcome-SMS"] },
        ]}
      />
    </CampaignShell>
  );
};

export default WhatsappCampaignComponent;
