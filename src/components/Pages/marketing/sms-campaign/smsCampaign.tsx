"use client";
import { useState } from "react";
import CampaignShell from "../components/campaignShell";
import ModalSmsCampaign from "./modal/modalSmsCampaign";
import { SmsCampaignListData } from "../../../../core/json/smsCampaignListData";
import {
  SMS_CAMPAIGN_COLUMNS,
  SMS_CAMPAIGN_MANAGE_COLUMNS,
  SMS_CAMPAIGN_KPIS,
  SMS_CAMPAIGN_FILTERS,
  smsCampaignTabs,
} from "./smsCampaignConfig";

const SmsCampaignComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <CampaignShell
      title="SMS Campaign"
      badgeCount={200}
      tabs={smsCampaignTabs("active")}
      kpis={SMS_CAMPAIGN_KPIS}
      columns={SMS_CAMPAIGN_COLUMNS}
      manageColumns={SMS_CAMPAIGN_MANAGE_COLUMNS}
      data={SmsCampaignListData}
      filters={SMS_CAMPAIGN_FILTERS}
      addLabel="Add New Campaign"
      addTarget="#offcanvas_add"
      searchText={searchText}
      onSearch={setSearchText}
    >
      <ModalSmsCampaign />
    </CampaignShell>
  );
};

export default SmsCampaignComponent;
