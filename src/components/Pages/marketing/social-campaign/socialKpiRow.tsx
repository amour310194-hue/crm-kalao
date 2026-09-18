"use client";
import { SOCIAL_CAMPAIGN_KPIS } from "./socialCampaignConfig";

/*
  Social Campaign's KPI row uses the `.social-card` variant from the reference -
  a coloured accent line across the top of each card, with the delta rendered as
  inline text rather than a badge. (The `.social-card` / `.line` rules were
  ported into react/src/style/css/style.css alongside this page.)
*/
const SocialKpiRow = () => (
  <div className="row">
    {SOCIAL_CAMPAIGN_KPIS.map((kpi) => (
      <div className="col-xxl-3 col-xl-6 col-md-6 col-sm-6" key={kpi.Label}>
        <div className="card shadow social-card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <span className={`line bg-${kpi.Tone}`} />
              <div>
                <h4 className="mb-1 fs-16">{kpi.Value}</h4>
                <p className="mb-1">{kpi.Label}</p>
                <div
                  className={`d-flex align-items-center text-${kpi.Tone} fs-12`}
                >
                  <span className="fs-12">{kpi.Delta}</span>
                  &nbsp;from last week
                </div>
              </div>
              <span
                className={`avatar avatar-lg rounded-circle bg-${kpi.IconTone} fs-24 flex-shrink-0`}
              >
                <i className={`ti ${kpi.Icon} fs-24`} />
              </span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SocialKpiRow;
