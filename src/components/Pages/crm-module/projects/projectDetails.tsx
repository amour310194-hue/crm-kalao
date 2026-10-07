"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import {
  Assigned_To,
  Reminder,
  Task_Priority,
} from "../../../../core/json/selectOption";
import CommonSelect from "@/core/common/common-select/commonSelect";
import ModalProjectDetails from "./modal/modalProjectDetails";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import {
  deleteAttachment,
  dossierFlag,
  fetchAttachments,
  fetchDossiers,
  fetchInvoicesForDossier,
  formatDate,
  isDossierClosed,
  type InvoiceRow,
  formatMoney,
  readForm,
  uploadAttachment,
  type AttachmentRow,
  type DossierRow,
} from "@/lib/crm";
import InvoiceComposer from "@/components/Pages/crm-module/invoices/InvoiceComposer";
import { t } from "@/lib/i18n";
import {
  createChecklistItem,
  createMilestone,
  createPurchase,
  deleteChecklistItem,
  deleteDossier,
  deleteMilestone,
  deletePurchase,
  fetchChecklist,
  fetchMilestones,
  fetchPurchases,
  setChecklistProvided,
  toggleMilestone,
  updateDossier,
  type DossierChecklistRow,
  type DossierMilestoneRow,
  type DossierPurchaseRow,
} from "@/lib/dossiers";
import KalaoDocsBar from "@/components/docs/KalaoDocsBar";
import { isCanadaProcedure } from "@/lib/org";
import { FichePipeline } from "../ficheLiveTabs";
import { pipelineStatusLabel, procedurePipeline } from "@/lib/visa-pipeline";

const KIND_LABEL: Record<string, string> = {
  chantier: "Chantier",
  plantation: "Plantation",
  voyage: "Voyage",
  visa: "Visa",
  evenement: "Événement",
  bien: "Bail / bien",
}

const ProjectDetailsComponent = () => {
  const dossierId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;
  const [dossierTitle, setDossierTitle] = useState("");
  const [dossierCode, setDossierCode] = useState("");
  const [files, setFiles] = useState<AttachmentRow[]>([]);
  const [dossier, setDossier] = useState<DossierRow | null>(null);
  const [milestones, setMilestones] = useState<DossierMilestoneRow[]>([]);
  const [purchases, setPurchases] = useState<DossierPurchaseRow[]>([]);
  const [checklist, setChecklist] = useState<DossierChecklistRow[]>([]);

  useEffect(() => {
    void fetchDossiers().then((rows) => {
      if (!rows?.length) return;
      const row = (dossierId ? rows.find((d) => d.id === dossierId) : null) ?? rows[0];
      setDossierTitle(row.title);
      setDossierCode(row.id.slice(0, 8).toUpperCase());
      setDossier(row);
    });
  }, [dossierId]);

  /** L'id vient de l'URL ; sans id on retombe sur le premier dossier chargé. */
  const currentId = dossier?.id ?? dossierId ?? null;
  const destination = dossier ? dossierFlag(dossier) : null;
  const live = true;
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [composer, setComposer] = useState(false);
  const [invoiceRevision, setInvoiceRevision] = useState(0);

  useEffect(() => {
    if (!currentId) return;
    void fetchInvoicesForDossier(currentId).then((rows) => {
      if (rows) setInvoices(rows);
    });
  }, [currentId, invoiceRevision]);

  const billed = invoices
    .filter((i) => i.status !== "draft" && i.status !== "cancelled")
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const collected = invoices.reduce((sum, i) => sum + Number(i.paid_amount), 0);
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled" && i.status !== "draft")
    .reduce((sum, i) => sum + Math.max(0, Number(i.amount) - Number(i.paid_amount)), 0);

  const reloadSuivi = useCallback(async (id: string | null) => {
    if (!id) return;
    const [mil, pur, chk] = await Promise.all([
      fetchMilestones(id),
      fetchPurchases(id),
      fetchChecklist(id),
    ]);
    if (mil) setMilestones(mil);
    if (pur) setPurchases(pur);
    if (chk) setChecklist(chk);
  }, []);

  useEffect(() => {
    void reloadSuivi(currentId);
  }, [currentId, reloadSuivi]);

  const guard = async (run: () => Promise<void>) => {
    try {
      await run();
      await reloadSuivi(currentId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onAddMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentId) return;
    const form = e.currentTarget;
    const vals = readForm(form);
    if (!vals.label?.trim()) return;
    await guard(async () => {
      await createMilestone({
        dossier_id: currentId,
        label: vals.label.trim(),
        due_at: vals.due_at || null,
      });
      form.reset();
    });
  };

  const onAddPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentId) return;
    const form = e.currentTarget;
    const vals = readForm(form);
    if (!vals.label?.trim()) return;
    await guard(async () => {
      await createPurchase({
        dossier_id: currentId,
        label: vals.label.trim(),
        amount: vals.amount,
        spent_at: vals.spent_at || null,
        supplier: vals.supplier || null,
      });
      form.reset();
    });
  };

  const onAddChecklistItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentId) return;
    const form = e.currentTarget;
    const vals = readForm(form);
    if (!vals.label?.trim()) return;
    await guard(async () => {
      await createChecklistItem({ dossier_id: currentId, label: vals.label.trim() });
      form.reset();
    });
  };

  const onUpdateDossier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentId) return;
    const vals = readForm(e.currentTarget);
    if (!vals.title?.trim()) {
      alert("Nom requis");
      return;
    }
    try {
      const saved = await updateDossier(currentId, {
        title: vals.title.trim(),
        status: vals.status || undefined,
        start_at: vals.start_at || null,
        end_at: vals.end_at || null,
        notes: vals.notes || null,
      });
      setDossier((prev) => (prev ? { ...prev, ...saved } : saved));
      setDossierTitle(saved.title);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onChangeStatus = async (status: string) => {
    if (!currentId) return;
    try {
      const saved = await updateDossier(currentId, { status });
      setDossier((prev) => (prev ? { ...prev, ...saved } : saved));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onDeleteDossier = async () => {
    if (!currentId) return;
    if (!confirm("Supprimer définitivement ce dossier et son suivi ?")) return;
    try {
      await deleteDossier(currentId);
      window.location.href = all_routes.projectsGrid;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const purchasesTotal = purchases.reduce((sum, row) => sum + Number(row.amount), 0);
  const checklistDone = checklist.filter((row) => row.provided).length;

  const reloadFiles = useCallback(async (id: string | null) => {
    if (!id) return;
    const rows = await fetchAttachments("dossier", id);
    if (rows) setFiles(rows);
  }, []);

  useEffect(() => {
    void reloadFiles(currentId);
  }, [currentId, reloadFiles]);

  const uploadToFiche = async (file: File) => {
    if (!currentId) return;
    await uploadAttachment({ file, entity_type: "dossier", entity_id: currentId });
    await reloadFiles(currentId);
  };

  const removeFile = async (id: string) => {
    await deleteAttachment(id);
    await reloadFiles(currentId);
    await reloadSuivi(currentId);
  };

  const attachToChecklist = async (itemId: string, file: File) => {
    if (!currentId) return;
    const saved = await uploadAttachment({
      file,
      entity_type: "dossier",
      entity_id: currentId,
    });
    await setChecklistProvided(itemId, true, saved.id);
    await reloadFiles(currentId);
  };

  return (
    <>
      {composer && dossier ? (
        <InvoiceComposer
          contactId={dossier.contact_id}
          dossierId={dossier.id}
          onClose={() => setComposer(false)}
          onSaved={() => setInvoiceRevision((value) => value + 1)}
        />
      ) : null}
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content pb-0">
          {/* Page Header */}
          <PageHeader
            title="Project"
            badgeCount={null}
            showModuleTile={false}
            showExport={true}
          />
          {/* End Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3">
                <Link href={all_routes.projectsGrid}>
                  <i className="ti ti-arrow-narrow-left me-1" />
                  Back to Projects
                </Link>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <div className="avatar avatar-xxl p-2 avatar-rounded border me-3 flex-shrink-0">
                        <ImageWithBasePath
                          src={destination?.src ?? "assets/img/priority/truellysel.svg"}
                          alt={destination?.label ?? "img"}
                          className="avatar avtart-sm rounded-circle"
                        />
                      </div>
                      <div>
                        <h5 className="mb-1">{dossierTitle}</h5>
                        <p className="mb-1">
                          Project Id :{" "}
                          <span className="text-dark fw-medium">{dossierCode}</span>
                        </p>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-sm badge-soft-danger fw-medium me-2 border-0">
                            <i className="ti ti-arrow-up-right me-1" />
                            {destination?.label ?? "High"}
                          </span>
                          <span
                            className={`badge badge-sm ${
                              dossier && isDossierClosed(dossier.status)
                                ? "bg-secondary"
                                : "bg-success"
                            }`}
                          >
                            {dossier && isDossierClosed(dossier.status)
                              ? "Clôturé"
                              : "Actif"}
                          </span>
                        </div>
                        {live && dossier ? (
                          <div className="mt-2">
                            <KalaoDocsBar
                              companyId={dossier.company_id}
                              invoices={invoices}
                              dossiers={[dossier]}
                            />
                            {isCanadaProcedure(dossier.title) ? (
                              <label className="form-check mt-1">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={Boolean(dossier.bassin_drawn)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    void updateDossier(dossier.id, {
                                      bassin_drawn: checked,
                                    }).then((saved) => {
                                      setDossier({ ...dossier, ...saved });
                                    });
                                  }}
                                />
                                <span className="form-check-label">
                                  Tiré du bassin (2e échéance 1 500 000 FCFA)
                                </span>
                              </label>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {dossier ? (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => setComposer(true)}>
                          {t("newInvoice")}
                        </button>
                      ) : null}
                      <span
                        className={`py-1 px-2 fs-12 bg-soft-danger rounded text-danger fw-medium${
                          dossier ? " d-none" : ""
                        }`}
                      >
                        <i className="ti ti-lock me-1" />
                        Private
                      </span>
                      <div className="dropdown">
                        <Link
                          href="#"
                          className="btn btn-xs btn-success fs-12 py-1 px-2 fw-medium d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {" "}
                          <i className="ti ti-thumb-up me-1" />
                          {dossier
                            ? pipelineStatusLabel(dossier.status, dossier.kind, dossier.title, dossier.notes)
                            : "Clôturé"}
                          <i className="ti ti-chevron-down ms-1" />{" "}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          {(dossier
                            ? procedurePipeline(dossier.kind, dossier.title, dossier.notes)
                            : procedurePipeline("visa")
                          ).map((step) => (
                            <Link
                              key={step.key}
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                void onChangeStatus(step.key);
                              }}
                            >
                              <span>{step.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
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
                  <h6 className="mb-3 fw-semibold">Informations du dossier</h6>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Date de début</p>
                      <p className="mb-0 text-dark">
                        {dossier ? formatDate(dossier.start_at) : " 27 Sep 2025, 11:45 PM"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Échéance</p>
                      <p className="mb-0 text-dark">
                        {dossier ? formatDate(dossier.end_at) : " 27 Sep 2025, 11:45 PM"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Achats engagés</p>
                      <p className="mb-0 text-dark">{formatMoney(purchasesTotal)}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">Type de dossier</p>
                      <p className="mb-0 text-dark">
                        {destination
                          ? `Immigration ${destination.label}`
                          : dossier
                            ? KIND_LABEL[dossier.kind] ?? dossier.kind
                            : "Mobile Application"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0">{dossier ? "Facturé" : "Project Timing"}</p>
                      <p className="mb-0 text-dark">
                        {dossier ? formatMoney(billed) : "Hourly"}
                      </p>
                    </div>
                    <div
                      className={`d-flex align-items-center justify-content-between mb-2${
                        dossier ? "" : " d-none"
                      }`}
                    >
                      <p className="mb-0">Encaissé</p>
                      <p className="mb-0 text-success">{formatMoney(collected)}</p>
                    </div>
                    <div
                      className={`d-flex align-items-center justify-content-between mb-2${
                        dossier ? "" : " d-none"
                      }`}
                    >
                      <p className="mb-0">Reste à encaisser</p>
                      <p className="mb-0 text-danger fw-medium">
                        {formatMoney(outstanding)}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Client</h6>
                    <Link href="#" className="link-primary mb-3">
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-xs rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/icons/company-icon-08.svg"
                          alt=""
                          className="img-fluid rounded-circle w-auto h-auto"
                        />
                      </span>
                      <div>
                        <p className="mb-0">
                          {dossier?.companies?.name ?? "Jessica Sen"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`d-flex align-items-center justify-content-between flex-wrap${
                      dossier ? " d-none" : ""
                    }`}
                  >
                    <h6 className="mb-3 fw-semibold">Responsible Persons</h6>
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
                  <div className={`mb-3${dossier ? " d-none" : ""}`}>
                    <div className="avatar-list-stacked avatar-group-sm">
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-01.jpg"
                          alt="img"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-02.jpg"
                          alt="img"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-03.jpg"
                          alt="img"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-04.jpg"
                          alt="img"
                        />
                      </span>
                      <span className="avatar avatar-rounded">
                        <ImageWithBasePath
                          className="border border-white"
                          src="assets/img/profiles/avatar-05.jpg"
                          alt="img"
                        />
                      </span>
                      <Link
                        className="avatar bg-light avatar-rounded text-dark"
                        href="#"
                      >
                        +1
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`d-flex align-items-center justify-content-between flex-wrap${
                      dossier ? " d-none" : ""
                    }`}
                  >
                    <h6 className="mb-3 fw-semibold">Team Leader</h6>
                    <Link href="#" className="link-primary mb-3">
                      Change
                    </Link>
                  </div>
                  <div className={`mb-3${dossier ? " d-none" : ""}`}>
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
                  <hr />
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="mb-0 fw-semibold">Pipeline</h6>
                    <p className="mb-0 fw-medium text-dark">
                      <i className="ti ti-timeline-event-text me-1" />
                      {dossier
                        ? pipelineStatusLabel(dossier.status, dossier.kind, dossier.title, dossier.notes)
                        : "—"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p className="mb-0">Dernière modification</p>
                    <p className="mb-0 text-dark">
                      {dossier ? formatDate(dossier.updated_at) : " 27 Sep 2025, 11:45 PM"}
                    </p>
                  </div>
                  <hr className={dossier ? "d-none" : ""} />
                  <div
                    className={`d-flex align-items-center justify-content-between mb-0${
                      dossier ? " d-none" : ""
                    }`}
                  >
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
              <FichePipeline
                status={dossier?.status}
                kind={dossier?.kind}
                title={dossier?.title}
                notes={dossier?.notes}
                onPick={(status) => {
                  if (dossier) void onChangeStatus(status);
                }}
              />
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
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_6"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-flag me-1" />
                          Suivi
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        href="#tab_7"
                        data-bs-toggle="tab"
                        aria-expanded="false"
                        className="nav-link border-3"
                        aria-selected="false"
                        tabIndex={-1}
                        role="tab"
                      >
                        <span className="d-md-inline-block">
                          <i className="ti ti-edit me-1" />
                          Dossier
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
          <div className="tab-pane fade" id="tab_6">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h5 className="fw-semibold mb-0">Jalons</h5>
                      <span className="badge badge-soft-info border-0">
                        {milestones.filter((m) => m.status === "done").length} / {milestones.length}{" "}
                        atteints
                      </span>
                    </div>
                    <div className="card-body">
                      <form className="row gy-2 align-items-end mb-3" onSubmit={onAddMilestone}>
                        <div className="col-md-6">
                          <label className="form-label">Jalon</label>
                          <input
                            type="text"
                            className="form-control"
                            name="label"
                            placeholder="Dépôt consulat, coulage dalle…"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Date prévue</label>
                          <input type="date" className="form-control" name="due_at" />
                        </div>
                        <div className="col-md-2">
                          <button type="submit" className="btn btn-primary w-100">
                            Ajouter
                          </button>
                        </div>
                      </form>
                      {milestones.length ? (
                        milestones.map((row) => (
                          <div className="card border shadow-none mb-3" key={row.id}>
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                                <div className="d-flex align-items-center">
                                  <span
                                    className={`avatar avatar-md flex-shrink-0 rounded me-2 ${
                                      row.status === "done" ? "bg-success" : "bg-warning"
                                    }`}
                                  >
                                    <i className="ti ti-flag fs-20" />
                                  </span>
                                  <div>
                                    <h6 className="fw-medium fs-14 mb-1">{row.label}</h6>
                                    <p className="mb-0">
                                      Prévu le {formatDate(row.due_at)}
                                      {row.done_at ? ` — fait le ${formatDate(row.done_at)}` : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-inline-flex align-items-center gap-2">
                                  <button
                                    type="button"
                                    className={`btn btn-sm ${
                                      row.status === "done" ? "btn-outline-light" : "btn-outline-success"
                                    }`}
                                    onClick={() => void guard(() => toggleMilestone(row))}
                                  >
                                    <i className="ti ti-checks me-1" />
                                    {row.status === "done" ? "Rouvrir" : "Marquer atteint"}
                                  </button>
                                  <button
                                    type="button"
                                    className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
                                    onClick={() => void guard(() => deleteMilestone(row.id))}
                                  >
                                    <i className="ti ti-trash" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="mb-0">Aucun jalon enregistré sur ce dossier.</p>
                      )}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h5 className="fw-semibold mb-0">Achats et dépenses</h5>
                      <span className="badge badge-soft-danger border-0">
                        Total {formatMoney(purchasesTotal)}
                      </span>
                    </div>
                    <div className="card-body">
                      <form className="row gy-2 align-items-end mb-3" onSubmit={onAddPurchase}>
                        <div className="col-md-4">
                          <label className="form-label">Libellé</label>
                          <input type="text" className="form-control" name="label" required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Montant (FCFA)</label>
                          <input type="text" className="form-control" name="amount" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Fournisseur</label>
                          <input type="text" className="form-control" name="supplier" />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Date</label>
                          <input type="date" className="form-control" name="spent_at" />
                        </div>
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary">
                            Ajouter l&apos;achat
                          </button>
                        </div>
                      </form>
                      {purchases.length ? (
                        <div className="table-responsive">
                          <table className="table table-nowrap mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Libellé</th>
                                <th>Fournisseur</th>
                                <th>Date</th>
                                <th className="text-end">Montant</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {purchases.map((row) => (
                                <tr key={row.id}>
                                  <td>{row.label}</td>
                                  <td>{row.supplier || "—"}</td>
                                  <td>{formatDate(row.spent_at)}</td>
                                  <td className="text-end text-dark fw-medium">
                                    {formatMoney(row.amount)}
                                  </td>
                                  <td className="text-end">
                                    <button
                                      type="button"
                                      className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
                                      onClick={() => void guard(() => deletePurchase(row.id))}
                                    >
                                      <i className="ti ti-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mb-0">Aucun achat rattaché à ce dossier.</p>
                      )}
                    </div>
                  </div>
                  <div className="card mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h5 className="fw-semibold mb-0">Pièces à fournir</h5>
                      <span className="badge badge-soft-success border-0">
                        {checklistDone} / {checklist.length} fournies
                      </span>
                    </div>
                    <div className="card-body">
                      <form className="row gy-2 align-items-end mb-3" onSubmit={onAddChecklistItem}>
                        <div className="col-md-10">
                          <label className="form-label">Pièce attendue</label>
                          <input
                            type="text"
                            className="form-control"
                            name="label"
                            placeholder="Passeport, justificatif d'hébergement…"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <button type="submit" className="btn btn-primary w-100">
                            Ajouter
                          </button>
                        </div>
                      </form>
                      {checklist.length ? (
                        checklist.map((row) => (
                          <div
                            className="d-flex align-items-center justify-content-between border-bottom py-2"
                            key={row.id}
                          >
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`chk_${row.id}`}
                                checked={row.provided}
                                onChange={(e) =>
                                  void guard(() => setChecklistProvided(row.id, e.target.checked))
                                }
                              />
                              <label className="form-check-label" htmlFor={`chk_${row.id}`}>
                                {row.label}
                              </label>
                            </div>
                            <div className="d-inline-flex align-items-center gap-2">
                              {row.attachment_id
                                ? (() => {
                                    const attached = files.find((file) => file.id === row.attachment_id);
                                    if (attached?.url) {
                                      return (
                                        <a
                                          href={attached.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="fs-13"
                                        >
                                          {attached.file_name}
                                        </a>
                                      );
                                    }
                                    return attached ? (
                                      <span className="fs-13">{attached.file_name}</span>
                                    ) : null;
                                  })()
                                : null}
                              <label className="action-icon btn btn-icon btn-sm btn-outline-light shadow mb-0">
                                <i className="ti ti-upload" />
                                <input
                                  type="file"
                                  className="d-none"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (!file) return;
                                    void guard(() => attachToChecklist(row.id, file));
                                  }}
                                />
                              </label>
                              <span
                                className={`badge ${row.provided ? "bg-success" : "badge-soft-warning border-0"}`}
                              >
                                {row.provided ? "Fournie" : "En attente"}
                              </span>
                              <button
                                type="button"
                                className="action-icon btn btn-icon btn-sm btn-outline-light shadow"
                                onClick={() => void guard(() => deleteChecklistItem(row.id))}
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="mb-0">Aucune pièce attendue sur ce dossier.</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Suivi Kalao */}
                {/* Dossier : édition et suppression */}
                <div className="tab-pane fade" id="tab_7">
                  <div className="card mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h5 className="fw-semibold mb-0">Modifier le dossier</h5>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => void onDeleteDossier()}
                        disabled={!currentId}
                      >
                        <i className="ti ti-trash me-1" />
                        Supprimer le dossier
                      </button>
                    </div>
                    <div className="card-body">
                      {dossier ? (
                        <form onSubmit={onUpdateDossier} key={dossier.id}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Nom <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="title"
                                  defaultValue={dossier.title}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <label className="form-label">Statut</label>
                                <select
                                  className="form-control"
                                  name="status"
                                  defaultValue={dossier.status}
                                  key={`${dossier.id}-${dossier.status}`}
                                >
                                  {procedurePipeline(dossier.kind, dossier.title, dossier.notes).map((step) => (
                                    <option key={step.key} value={step.key}>
                                      {step.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <label className="form-label">Date de début</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="start_at"
                                  defaultValue={dossier.start_at ?? ""}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-3">
                                <label className="form-label">Échéance</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="end_at"
                                  defaultValue={dossier.end_at ?? ""}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  name="notes"
                                  defaultValue={dossier.notes ?? ""}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-end">
                            <button type="submit" className="btn btn-primary">
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="mb-0">Dossier introuvable.</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Dossier */}
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
      <ModalProjectDetails />
    </>
  );
};

export default ProjectDetailsComponent;
