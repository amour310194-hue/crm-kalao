"use client";
/*
  WhatsApp Campaign's KPI row (html/whatsapp-campaign.html).

  This family uses a different stat-card design from the other three: a bordered
  card with the label and tinted value on the left, a soft-tinted icon bubble on
  the right, and a divider above the delta line. Its metrics are also different -
  Read Rate / Reply Rate rather than Sent / Opened.
*/
const KPIS = [
  { Label: "Campaign", Value: "474", Icon: "ti-box", Tone: "primary", Delta: "+18.45%" },
  { Label: "Read Rate", Value: "99%", Icon: "ti-book-download", Tone: "warning", Delta: "+16.55%" },
  { Label: "Reply Rate", Value: "80%", Icon: "ti-replace", Tone: "info", Delta: "+3.21%" },
  { Label: "Active Campaign", Value: "325", Icon: "ti-align-box-right-stretch", Tone: "success", Delta: "+18.45%" },
];

const WhatsappKpiRow = () => (
  <div className="row">
    {KPIS.map((kpi) => (
      <div className="col-xl-3 col-md-6" key={kpi.Label}>
        <div className={`card shadow border-${kpi.Tone}`}>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
              <div>
                <p className="mb-1">{kpi.Label}</p>
                <h4 className={`mb-0 fs-16 text-${kpi.Tone}`}>{kpi.Value}</h4>
              </div>
              <span
                className={`avatar avatar-lg rounded-circle bg-soft-${kpi.Tone} text-${kpi.Tone} fs-24 flex-shrink-0`}
              >
                <i className={`ti ${kpi.Icon} fs-24`} />
              </span>
            </div>
            <div className="d-flex align-items-center text-dark fs-12">
              <span className="text-success me-1">{kpi.Delta}</span>
              from last week
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default WhatsappKpiRow;
