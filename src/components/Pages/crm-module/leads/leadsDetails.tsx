"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import PageHeader from "@/core/common/page-header/pageHeader";
import CommonSelect from "@/core/common/common-select/commonSelect";
import {
  Assigned_To,
  Priority,
  Reminder,
  Task_Priority,
} from "../../../../core/json/selectOption";
import Footer from "@/core/common/footer/footer";
import ModalLeadsDetails from "./modal/modalLeadsDetails";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import {
  convertLead,
  fetchLeads,
  formatMoney,
  LEAD_STATUS_LABEL,
  type LeadRow,
} from "@/lib/crm";
import { fetchCatalogItems, formatCatalogPrice, type CatalogItem } from "@/lib/catalog";

const LeadsDetailsComponent = () => {
  const [lead, setLead] = useState<LeadRow | null>(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    void fetchLeads().then((rows) => {
      const row = id ? rows?.find((item) => item.id === id) : null;
      if (row) setLead(row);
    });
  }, []);

  const refreshLead = async (id: string) => {
    const rows = await fetchLeads();
    const row = rows?.find((item) => item.id === id);
    if (row) setLead(row);
  };

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="Leads"
            badgeCount={null}
            showModuleTile={false}
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <Link href={all_routes.leads}>
                  <i className="ti ti-arrow-narrow-left me-1" />
                  Back to Leads
                </Link>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <div className="avatar avatar-xxl avatar-rounded border border-warning bg-soft-warning me-3 flex-shrink-0">
                        <h6 className="mb-0 text-warning">HT</h6>
                      </div>
                      <div>
                        <h5 className="mb-1">{lead?.title ?? "Prospect"}</h5>
                        {lead ? (
                          <p className="mb-1">
                            <i className="ti ti-building-skyscraper me-1" />
                            {lead.companies?.name ?? "—"} ·{" "}
                            {LEAD_STATUS_LABEL[lead.status] ?? lead.status} ·{" "}
                            {formatMoney(lead.estimated_value)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {lead && lead.status !== "converted" ? (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setConverting(true)}>
                          Convertir en client
                        </button>
                      ) : lead?.status === "converted" ? (
                        <span className="badge bg-success">Converti</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              {/* /Contact User */}
            </div>
            {/* Contact Sidebar */}
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Lead Information</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Date Created</p>
                      <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Deal Value</p>
                      <p className="mb-0 text-dark">FCFA 25,11,145</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Due Date </p>
                      <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Follow Up</p>
                      <p className="mb-0 text-dark">27 Sep 2025</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Source</p>
                      <p className="mb-0 text-dark">Google</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Owner</h6>
                  </div>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-3.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Steve Vaughan</p>
                      </div>
                    </div>
                  </div>
                  <h6 className="mb-3 fw-semibold">Tags</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <Link
                      href="#"
                      className="badge badge-soft-success fw-medium me-2"
                    >
                      Collab
                    </Link>
                    <Link
                      href="#"
                      className="badge badge-soft-warning fw-medium mb-0"
                    >
                      VIP
                    </Link>
                  </div>
                  <h6 className="mb-3 fw-semibold">Priority</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <CommonSelect
                      options={Priority}
                      className="select"
                      defaultValue={Priority[0]}
                    />
                  </div>
                  <h6 className="mb-3 fw-semibold">Projects</h6>
                  <div className="d-flex align-items-center border-bottom mb-3 pb-3">
                    <span className="badge bg-white text-body fw-medium border me-2">
                      Devops Design
                    </span>
                    <span className="badge bg-white text-body fw-medium border me-2">
                      Margrate Design
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Conracts</h6>
                    <Link
                      href="#"
                      className="link-primary mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#add_contact"
                    >
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-4.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Jessica Sen</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="mb-0">Last Modified </p>
                    <p className="mb-0 text-dark"> 27 Sep 2025, 11:45 PM</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <p className="mb-0">Modified By</p>
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/users/avatar-2.jpg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">Darlee Robertson</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
            {/* Contact Details */}
            <div className="col-xl-8">
              <div className="mb-3 pb-3 border-bottom">
                <h5 className="mb-3">Lead Pipeline Status</h5>
                <div className="step-progress d-flex flex-wrap gap-2">
                  <div className="step bg-indigo">Not Contacted</div>
                  <div className="step bg-cyan">Contacted</div>
                  <div className="step bg-success">Closed</div>
                  <div className="step bg-orange">Lost</div>
                  <div className="step bg-transparent" />
                </div>
              </div>
              <div className="card mb-3">
                <div className="card-body pb-0 pt-2 px-2">
                  <ul
                    className="nav nav-tabs nav-bordered border-0 mb-0"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_1"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link active border-3"
                        aria-selected="true"
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-alarm-minus me-1" />
                          Activities
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_2"
                        data-bs-toggle="tab"
                        aria-expanded="true"
                        className="nav-link border-3"
                        aria-selected="false"
                        role="tab"
                        tabIndex={-1}
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-notes me-1" />
                          Notes
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_3"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-phone me-1" />
                          Calls
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_4"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-file me-1" />
                          Files
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_5"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-mail-check me-1" />
                          Email
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
                        {/* Tab Content */}
          <div className="tab-content pt-0">
            <div className="tab-pane active show" id="tab_1">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucune activité.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_2">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucune note.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_3">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun appel.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_4">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun fichier.</p></div></div>
            </div>
            <div className="tab-pane fade" id="tab_5">
              <div className="card"><div className="card-body"><p className="mb-0 text-muted">Aucun e-mail.</p></div></div>
            </div>
          </div>
          {/* /Tab Content */}
            </div>
            {/* /Contact Details */}
          </div>
          {/* Start Footer */}
        </div>
        {/* End Content */}
        <Footer />
        {/* End Footer */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
        <ModalLeadsDetails/>
        {converting && lead ? (
          <ConvertModal
            lead={lead}
            onClose={() => setConverting(false)}
            onDone={async () => {
              setConverting(false);
              await refreshLead(lead.id);
            }}
          />
        ) : null}
    </>
  );
};

function ConvertModal({
  lead,
  onClose,
  onDone,
}: {
  lead: LeadRow;
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const [services, setServices] = useState<CatalogItem[]>([]);
  const [catalogItemId, setCatalogItemId] = useState("");
  const [companyName, setCompanyName] = useState(lead.companies?.name ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchCatalogItems().then((rows) => {
      setServices((rows ?? []).filter((item) => item.kind === "service" && item.status === "active"));
    });
  }, []);

  const selected = services.find((item) => item.id === catalogItemId);

  const submit = async () => {
    if (!selected) {
      setError("Choisissez un service.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await convertLead(lead.id, {
        catalogItemId: selected.id,
        label: selected.name,
        unitPrice: Number(selected.unit_price ?? 0),
        taxRate: Number(selected.tax_rate ?? 0),
        companyName: companyName.trim() || undefined,
      });
      await onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,.45)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Convertir en client</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <p className="text-muted small">
              Un lead ne devient client qu&apos;après souscription à un service (affaire gagnée).
            </p>
            <div className="mb-3">
              <label className="form-label">Service souscrit</label>
              <select
                className="form-select"
                value={catalogItemId}
                onChange={(e) => setCatalogItemId(e.target.value)}
              >
                <option value="">Choisir un service…</option>
                {services.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {formatCatalogPrice(item.unit_price)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Société cliente (optionnel)</label>
              <input
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>
            {error ? <p className="text-danger small mb-0">{error}</p> : null}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>
              Annuler
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void submit()} disabled={busy}>
              {busy ? "Conversion…" : "Créer l'affaire et convertir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadsDetailsComponent;
