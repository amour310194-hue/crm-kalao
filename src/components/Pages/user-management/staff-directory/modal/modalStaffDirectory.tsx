"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  closeBootstrapChrome,
  createEmployee,
  fetchDepartments,
  fetchEmployees,
  parseAmount,
  readForm,
  updateEmployee,
} from "@/lib/crm";

const ROLES = [
  "Sales Lead",
  "Content Writer",
  "Accountant",
  "UI Designer",
  "Support Lead",
];
const COUNTRIES = ["Cameroun", "Côte d'Ivoire", "Sénégal", "France"];
const STATES = ["California", "New York", "Texas", "Florida"];
const CITIES = ["Los Angeles", "San Diego", "Fresno", "San Francisco"];

const Select = ({
  options,
  name,
}: {
  options: string[];
  name?: string;
}) => (
  <select className="form-select" name={name} defaultValue="Select">
    <option>Select</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

type StaffFormProps = {
  submitLabel: string;
  departmentOptions: { id: string; name: string }[];
};

const StaffForm = ({ submitLabel, departmentOptions }: StaffFormProps) => (
  <>
    <div className="modal-body">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Profile Image</label>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2">
                <i className="ti ti-file-broken me-1" />
                Upload file
                <input type="file" className="form-control image-sign" multiple />
              </div>
              <span>JPG, GIF or PNG. Max size of 800K</span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              First Name<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" name="first_name" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Last Name<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" name="last_name" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Email<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" name="email" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Phone<span className="text-danger ms-1">*</span>
            </label>
            <input className="form-control" name="phone" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Department<span className="text-danger ms-1">*</span>
            </label>
            <select className="form-select" name="department_ids" multiple size={4}>
              {departmentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Role<span className="text-danger ms-1">*</span>
            </label>
            <Select options={ROLES} name="job_title" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">
              Address Line 1<span className="text-danger ms-1">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Address Line 1</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Country<span className="text-danger ms-1">*</span>
            </label>
            <Select options={COUNTRIES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              State<span className="text-danger ms-1">*</span>
            </label>
            <Select options={STATES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3 mb-md-0">
            <label className="form-label">
              City<span className="text-danger ms-1">*</span>
            </label>
            <Select options={CITIES} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-0">
            <label className="form-label">
              Pincode<span className="text-danger ms-1">*</span>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-12">
          <hr />
          <p className="fw-semibold mb-2">Paie et contrat Kalao</p>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Intitulé réel</label>
            <input className="form-control" name="job_title_custom" placeholder="PDG, DG, Secrétaire…" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Type de contrat</label>
            <select className="form-select" name="contract_type" defaultValue="CDI">
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Salaire de base (FCFA)</label>
            <input className="form-control" name="salary_base" inputMode="numeric" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Prime de rendement</label>
            <input className="form-control" name="bonus_performance" inputMode="numeric" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Prime de responsabilité</label>
            <input className="form-control" name="bonus_responsibility" inputMode="numeric" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Indemnité de transport</label>
            <input className="form-control" name="transport_allowance" inputMode="numeric" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Date d'embauche</label>
            <input className="form-control" name="hired_at" type="date" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Heures / semaine</label>
            <input className="form-control" name="weekly_hours" defaultValue="40" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Date de naissance</label>
            <input className="form-control" name="birth_date" type="date" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Lieu de naissance</label>
            <input className="form-control" name="birth_place" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Nationalité</label>
            <input className="form-control" name="nationality" defaultValue="Camerounaise" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Passeport / CNI</label>
            <input className="form-control" name="passport_no" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">N° CNPS</label>
            <input className="form-control" name="cnps_number" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Adresse</label>
            <input className="form-control" name="address" />
          </div>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      <Link href="#" className="btn btn-light" data-bs-dismiss="modal">
        Cancel
      </Link>
      <button className="btn btn-primary" type="submit">
        {submitLabel}
      </button>
    </div>
  </>
);

type ModalStaffDirectoryProps = { onSaved?: () => void };

const ModalStaffDirectory = ({ onSaved }: ModalStaffDirectoryProps) => {
  const [departmentOptions, setDepartmentOptions] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    void fetchDepartments().then((rows) => {
      if (rows) setDepartmentOptions(rows.map((d) => ({ id: d.id, name: d.name })));
    });
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const vals = readForm(form);
      const selected = Array.from(
        form.querySelectorAll<HTMLOptionElement>(
          'select[name="department_ids"] option:checked'
        )
      ).map((o) => o.value);
      await createEmployee({
        full_name: `${vals.first_name || ""} ${vals.last_name || ""}`.trim() || "Collaborateur",
        email: vals.email || null,
        phone: vals.phone || null,
        job_title:
          vals.job_title_custom ||
          (vals.job_title && vals.job_title !== "Select" ? vals.job_title : null),
        department_ids: selected,
        salary_base: parseAmount(vals.salary_base),
        bonus_performance: parseAmount(vals.bonus_performance),
        bonus_responsibility: parseAmount(vals.bonus_responsibility),
        transport_allowance: parseAmount(vals.transport_allowance),
        birth_date: vals.birth_date || null,
        birth_place: vals.birth_place || null,
        nationality: vals.nationality || null,
        passport_no: vals.passport_no || null,
        address: vals.address || null,
        contract_type: vals.contract_type || "CDI",
        hired_at: vals.hired_at || null,
        weekly_hours: parseAmount(vals.weekly_hours) || 40,
        cnps_number: vals.cnps_number || null,
      });
      onSaved?.();
      closeBootstrapChrome(form);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const staffPay = (vals: Record<string, string>) => ({
    job_title:
      vals.job_title_custom ||
      (vals.job_title && vals.job_title !== "Select" ? vals.job_title : undefined),
    salary_base: parseAmount(vals.salary_base),
    bonus_performance: parseAmount(vals.bonus_performance),
    bonus_responsibility: parseAmount(vals.bonus_responsibility),
    transport_allowance: parseAmount(vals.transport_allowance),
    birth_date: vals.birth_date || null,
    birth_place: vals.birth_place || null,
    nationality: vals.nationality || null,
    passport_no: vals.passport_no || null,
    address: vals.address || null,
    contract_type: vals.contract_type || "CDI",
    hired_at: vals.hired_at || null,
    weekly_hours: parseAmount(vals.weekly_hours) || 40,
    cnps_number: vals.cnps_number || null,
    phone: vals.phone || null,
    email: vals.email || null,
  });

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const vals = readForm(form);
      const email = vals.email?.trim();
      if (!email) throw new Error("Indiquez l'e-mail du collaborateur à mettre à jour");
      const rows = await fetchEmployees();
      const match = rows?.find((row) => row.email === email);
      if (!match) throw new Error("Aucun collaborateur avec cet e-mail");
      await updateEmployee(match.id, staffPay(vals));
      onSaved?.();
      closeBootstrapChrome(form);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <>
      <div className="modal fade" id="add-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Staff</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={onCreate}>
              <StaffForm
                submitLabel="Create New"
                departmentOptions={departmentOptions}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="edit-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Staff</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={onUpdate}>
              <StaffForm
                submitLabel="Save Changes"
                departmentOptions={departmentOptions}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="delete_modal">
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
                Are you sure you want to remove Employee you selected.
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  href="#"
                  className="btn btn-light position-relative z-1 me-2 w-100"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  href="#"
                  className="btn btn-primary position-relative z-1 w-100"
                  data-bs-dismiss="modal"
                >
                  Yes, Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalStaffDirectory;
