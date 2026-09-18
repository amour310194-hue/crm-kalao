"use client";
import CampaignOffcanvas from "../../components/campaignOffcanvas";

const ModalSmsCampaign = () => (
  <CampaignOffcanvas
    fields={[
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

export default ModalSmsCampaign;
