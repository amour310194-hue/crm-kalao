"use client";
/* eslint-disable @next/next/no-img-element */
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { useEffect, useState } from "react";
import {
  Category,
  Client,
  Priority,
  Project_Timing,
  Project_Type,
  StatusActive,
} from "../../../../../core/json/selectOption";
import CommonSelect from "@/core/common/common-select/commonSelect";
import type { Option } from "@/core/common/common-select/commonSelect";
import MultipleSelect from "@/core/common/multiple-Select/multipleSelect";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import { fetchCatalogItems } from "@/lib/catalog";
import {
  closeBootstrapChrome,
  createDossier,
  emptyUuid,
  fetchCompanies,
  fetchEmployees,
  readForm,
  type DossierRow,
} from "@/lib/crm";
import { deleteDossier, updateDossier } from "@/lib/dossiers";

type ModalProjectProps = {
  onSaved?: () => void;
  defaultKind?: string | null;
  /** Dossier visé par l'offcanvas d'édition et le modal de suppression. */
  editing?: DossierRow | null;
};

const ModalProject = ({ onSaved, defaultKind, editing }: ModalProjectProps) => {
  const [companyOptions, setCompanyOptions] = useState<Option[]>(Client);
  const [employeeOptions, setEmployeeOptions] = useState<Option[]>([{ value: "", label: "Select" }]);
  const [catalogOptions, setCatalogOptions] = useState<Option[]>([{ value: "", label: "Select" }]);
  const typeDefault =
    Project_Type.find((o) => o.value === defaultKind) ?? Project_Type[0];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleChange = (value: string[]) => {
    setSelectedItems(value);
  };

  useEffect(() => {
    void fetchCompanies().then((rows) => {
      if (!rows) return;
      setCompanyOptions([
        { value: "", label: "Select" },
        ...rows.map((c) => ({ value: c.id, label: c.name })),
      ]);
    });
    void fetchEmployees().then((rows) => {
      if (!rows) return;
      setEmployeeOptions([
        { value: "", label: "Select" },
        ...rows.map((e) => ({ value: e.id, label: e.full_name })),
      ]);
    });
    void fetchCatalogItems().then((rows) => {
      if (!rows) return;
      setCatalogOptions([
        { value: "", label: "Select" },
        ...rows.map((c) => ({ value: c.id, label: c.name })),
      ]);
    });
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const vals = readForm(e.currentTarget);
      if (!vals.title?.trim()) {
        alert("Nom requis");
        return;
      }
      await createDossier({
        title: vals.title.trim(),
        kind: vals.kind || defaultKind || "chantier",
        company_id: emptyUuid(vals.company_id),
        employee_id: emptyUuid(vals.employee_id),
        catalog_item_id: emptyUuid(vals.catalog_item_id),
        notes: vals.notes || null,
        start_at: vals.start_at || null,
        end_at: vals.end_at || null,
      });
      onSaved?.();
      closeBootstrapChrome(e.currentTarget);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const vals = readForm(e.currentTarget);
      if (!vals.title?.trim()) {
        alert("Nom requis");
        return;
      }
      await updateDossier(editing.id, {
        title: vals.title.trim(),
        kind: vals.kind || undefined,
        company_id: vals.company_id,
        start_at: vals.start_at || null,
        end_at: vals.end_at || null,
        notes: vals.notes || null,
      });
      onSaved?.();
      closeBootstrapChrome(e.currentTarget);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onDelete = async (from: HTMLElement) => {
    if (!editing) return;
    try {
      await deleteDossier(editing.id);
      onSaved?.();
      closeBootstrapChrome(from);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };
   const options = [
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-02.jpg"
              alt="Robert"
              width={24}
              height={24}
            />
          </div>
          Robert Johnson
        </div>
      ),
      value: "robert-johnson",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/users/user-01.jpg"
              alt="Sharon"
              width={24}
              height={24}
            />
          </div>
          Sharon Roy
        </div>
      ),
      value: "sharon-roy",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-21.jpg"
              alt="Vaughan"
              width={24}
              height={24}
            />
          </div>
          Vaughan Lewis
        </div>
      ),
      value: "vaughan-lewis",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-23.jpg"
              alt="Jessica"
              width={24}
              height={24}
            />
          </div>
          Jessica Louise
        </div>
      ),
      value: "jessica-louise",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-16.jpg"
              alt="Carol"
              width={24}
              height={24}
            />
          </div>
          Carol Thomas
        </div>
      ),
      value: "carol-thomas",
    },
  ];

  const [selectedItems2, setSelectedItems2] = useState<string[]>([]);

  const handleChange2 = (value: string[]) => {
    setSelectedItems2(value);
  };
 const options2 = [
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-19.jpg"
              alt="Robert"
              width={24}
              height={24}
            />
          </div>
         Darlee Robertson
        </div>
      ),
      value: "robert-johnson",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/users/user-01.jpg"
              alt="Sharon"
              width={24}
              height={24}
            />
          </div>
          Sharon Roy
        </div>
      ),
      value: "sharon-roy",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-21.jpg"
              alt="Vaughan"
              width={24}
              height={24}
            />
          </div>
          Vaughan Lewis
        </div>
      ),
      value: "vaughan-lewis",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-23.jpg"
              alt="Jessica"
              width={24}
              height={24}
            />
          </div>
          Jessica Louise
        </div>
      ),
      value: "jessica-louise",
    },
    {
      label: (
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 24,
              height: 24,
            }}
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-16.jpg"
              alt="Carol"
              width={24}
              height={24}
            />
          </div>
          Carol Thomas
        </div>
      ),
      value: "carol-thomas",
    },
  ];
  return (
    <>
      {/* Add Canvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Project</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={onCreate}>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" name="title" required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project ID<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Type <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="kind"
                    options={Project_Type}
                    className="select"
                    defaultValue={typeDefault}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Client <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="company_id"
                    options={companyOptions}
                    className="select"
                    defaultValue={companyOptions[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="employee_id"
                    options={employeeOptions}
                    className="select"
                    defaultValue={employeeOptions[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Timing <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="catalog_item_id"
                    options={catalogOptions}
                    className="select"
                    defaultValue={catalogOptions[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Responsible Persons <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems}
                    onChange={handleChange}
                    options={options}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Team Leader <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems2}
                    onChange={handleChange2}
                    options={options2}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <input type="date" name="start_at" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <input type="date" name="end_at" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <CommonSelect
                    options={Priority}
                    className="select"
                    defaultValue={Priority[0]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CommonSelect
                    options={StatusActive}
                    className="select"
                    defaultValue={StatusActive[0]}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    name="notes"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create New
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add Canvas */}
      {/* Add Canvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_edit"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">{editing ? `Edit — ${editing.title}` : "Edit Project"}</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={onUpdate} key={editing?.id ?? "edit"}>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    defaultValue={editing?.title ?? "Truelysell"}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    defaultValue={
                      editing ? `#${editing.id.slice(0, 8).toUpperCase()}` : "#274729"
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Type <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="kind"
                    options={Project_Type}
                    className="select"
                    defaultValue={
                      Project_Type.find((o) => o.value === editing?.kind) ?? Project_Type[1]
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Client <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    name="company_id"
                    options={companyOptions}
                    className="select"
                    defaultValue={
                      companyOptions.find((o) => o.value === editing?.company_id) ??
                      companyOptions[0]
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    options={Category}
                    className="select"
                    defaultValue={Category[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Timing <span className="text-danger">*</span>
                  </label>
                  <CommonSelect
                    options={Project_Timing}
                    className="select"
                    defaultValue={Project_Timing[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="2,15,000"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Responsible Persons <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems}
                    onChange={handleChange}
                    options={options}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Team Leader <span className="text-danger">*</span>
                  </label>
                  <MultipleSelect
                    value={selectedItems2}
                    onChange={handleChange2}
                    options={options2}
                    placeholder="Select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <input
                      type="date"
                      name="start_at"
                      className="form-control"
                      defaultValue={editing?.start_at ?? ""}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="input-group w-auto input-group-flat">
                    <input
                      type="date"
                      name="end_at"
                      className="form-control"
                      defaultValue={editing?.end_at ?? ""}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <CommonSelect
                    options={Priority}
                    className="select"
                    defaultValue={Priority[1]}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CommonSelect
                    options={StatusActive}
                    className="select"
                    defaultValue={StatusActive[1]}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    name="notes"
                    defaultValue={
                      editing?.notes ?? "Provides a multiple ondemand service marketplace"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add Canvas */}
      {/* success modal */}
      <div className="modal fade" id="create_success">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-info border-0 text-info rounded-circle">
                  <i className="ti ti-atom-2 fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Project Created Successfully!!!</h5>
              <p className="mb-3">View the details of project, created</p>
              <div className="d-flex justify-content-center">
                <Link
                  href="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  href={all_routes.projectDetails}
                  className="btn btn-primary position-relative z-1 w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* success modal */}
      {/* delete modal */}
      <div className="modal fade" id="delete_project">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content rounded-0">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                {editing
                  ? `Supprimer définitivement « ${editing.title} » et son suivi ?`
                  : "Are you sure you want to remove project you selected."}
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  href="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  className="btn btn-primary position-relative z-1 w-100"
                  onClick={(e) => void onDelete(e.currentTarget)}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete modal */}
    </>
  );
};

export default ModalProject;
