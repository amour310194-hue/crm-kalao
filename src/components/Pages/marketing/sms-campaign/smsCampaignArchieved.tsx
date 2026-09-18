"use client";
import { useState } from "react";
import CampaignShell from "../components/campaignShell";
import ModalSmsCampaign from "./modal/modalSmsCampaign";
import { SmsCampaignArchievedListData } from "../../../../core/json/smsCampaignArchievedListData";
import {
  SMS_CAMPAIGN_COLUMNS,
  SMS_CAMPAIGN_MANAGE_COLUMNS,
  SMS_CAMPAIGN_KPIS,
  SMS_CAMPAIGN_FILTERS,
  smsCampaignTabs,
} from "./smsCampaignConfig";

const SmsCampaignArchievedComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <CampaignShell
      title="SMS Campaign"
      badgeCount={200}
      tabs={smsCampaignTabs("archived")}
      kpis={SMS_CAMPAIGN_KPIS}
      columns={SMS_CAMPAIGN_COLUMNS}
      manageColumns={SMS_CAMPAIGN_MANAGE_COLUMNS}
      data={SmsCampaignArchievedListData}
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

export default SmsCampaignArchievedComponent;
