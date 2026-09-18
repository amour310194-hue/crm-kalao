"use client";
import CampaignOffcanvas from "../../components/campaignOffcanvas";

const ModalEmailCampaign = () => (
  <CampaignOffcanvas
    fields={[
      {
        Label: "Campaign Type",
        Options: ["Choose", "Promotional", "Product Update", "New Signups"],
      },
      {
        Label: "Email Template",
        Options: [
          "Select",
          "Update-Template-01",
          "Sales-Template-03",
          "Reengage-Template-01",
        ],
      },
    ]}
  />
);

export default ModalEmailCampaign;
