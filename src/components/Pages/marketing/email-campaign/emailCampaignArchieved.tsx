"use client";
import { useState } from "react";
import CampaignShell from "../components/campaignShell";
import ModalEmailCampaign from "./modal/modalEmailCampaign";
import { EmailCampaignArchievedListData } from "../../../../core/json/emailCampaignArchievedListData";
import {
  EMAIL_CAMPAIGN_COLUMNS,
  EMAIL_CAMPAIGN_MANAGE_COLUMNS,
  EMAIL_CAMPAIGN_KPIS,
  EMAIL_CAMPAIGN_FILTERS,
  emailCampaignTabs,
} from "./emailCampaignConfig";

const EmailCampaignArchievedComponent = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <CampaignShell
      title="Email Campaign"
      badgeCount={125}
      tabs={emailCampaignTabs("archived")}
      kpis={EMAIL_CAMPAIGN_KPIS}
      columns={EMAIL_CAMPAIGN_COLUMNS}
      manageColumns={EMAIL_CAMPAIGN_MANAGE_COLUMNS}
      data={EmailCampaignArchievedListData}
      filters={EMAIL_CAMPAIGN_FILTERS}
      addLabel="Add New Campaign"
      addTarget="#offcanvas_add"
      searchText={searchText}
      onSearch={setSearchText}
    >
      <ModalEmailCampaign />
    </CampaignShell>
  );
};

export default EmailCampaignArchievedComponent;
