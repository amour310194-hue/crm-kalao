"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import CommonDatePicker from "@/core/common/common-datePicker/commonDatePicker";
import TextEditor from "@/core/common/texteditor/texteditor";
import {
  QuotationClientOptions,
  QuotationCurrencyOptions,
  QuotationProductOptions,
  QuotationEditProductOptions,
  QuotationDiscountOptions,
  QuotationEditDiscountOptions,
  QuotationClientPickList,
} from "../../../../../core/json/quotationsListData";
import {
  closeBootstrapChrome,
  createQuote,
  emptyUuid,
  fetchCompanies,
  parseAmount,
  readForm,
} from "@/lib/crm";
import { fetchCatalogItems, type CatalogItem } from "@/lib/catalog";

type ModalQuotationsProps = { onSaved?: () => void };

const ModalQuotations = ({ onSaved }: ModalQuotationsProps) => {
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  useEffect(() => {
    void fetchCompanies().then((rows) => {
      if (rows) setCompanies(rows.map((c) => ({ id: c.id, name: c.name })));
    });
    void fetchCatalogItems().then((rows) => {
      if (rows) setCatalog(rows);
    });
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const vals = readForm(form);
      const productIds = form.querySelectorAll<HTMLSelectElement>(
        'select[name="line_product"]'
      );
      const qtys = form.querySelectorAll<HTMLInputElement>('input[name="line_qty"]');
      const prices = form.querySelectorAll<HTMLInputElement>(
        'input[name="line_price"]'
      );
      const lines = Array.from(productIds)
        .map((select, i) => {
          const item = catalog.find((c) => c.id === select.value);
          const qty = parseAmount(qtys[i]?.value) || 1;
          const price = parseAmount(prices[i]?.value) || item?.unit_price || 0;
          if (!item && !vals.amount) return null;
          return {
            catalog_item_id: item?.id || null,
            kind: (item?.kind || "product") as "product" | "service",
            label: item?.name || "Ligne",
            quantity: qty,
            unit_price: price,
            tax_rate: item?.tax_rate ?? 20,
          };
        })
        .filter(Boolean) as {
        catalog_item_id: string | null;
        kind: "product" | "service";
        label: string;
        quantity: number;
        unit_price: number;
        tax_rate: number;
      }[];
      if (!lines.length && parseAmount(vals.amount)) {
        lines.push({
          catalog_item_id: catalog[0]?.id || null,
          kind: catalog[0]?.kind || "product",
          label: catalog[0]?.name || "Prestation",
          quantity: 1,
          unit_price: parseAmount(vals.amount),
          tax_rate: 20,
        });
      }
      await createQuote({
        company_id: emptyUuid(vals.company_id),
        notes: vals.notes || null,
        lines,
      });
      onSaved?.();
      closeBootstrapChrome(form);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <>
      {/* Add Canvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="add-offcanvas"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Quotation</h5>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <form onSubmit={onCreate}>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Client</label>
                    <Link
                      href="#"
                      className="label-add link-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_client"
                    >
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <select className="form-control" name="company_id">
                    <option value="">Select</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" name="amount" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <select className="select">
                    {QuotationCurrencyOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Valid Till</label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <div className="editor custom-editor">
                    <TextEditor />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="table-responsive custom-table table-nowrap">
                  <table className="table table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Amount</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="product-list">
                        <td className="product-select">
                          <select className="form-control" name="line_product">
                            <option value="">Select</option>
                            {catalog.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                            {QuotationProductOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" name="line_qty" />
                        </td>
                        <td>
                          <input className="form-control" name="line_price" />
                        </td>
                        <td>
                          <select className="select">
                            {QuotationDiscountOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" />
                        </td>
                        <td />
                      </tr>
                      <tr className="product-list">
                        <td className="product-select">
                          <select className="form-control" name="line_product">
                            <option value="">Select</option>
                            {catalog.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                            {QuotationProductOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" name="line_qty" />
                        </td>
                        <td>
                          <input className="form-control" name="line_price" />
                        </td>
                        <td>
                          <select className="select">
                            {QuotationDiscountOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" />
                        </td>
                        <td>
                          <Link href="#" className="text-danger remove-product">
                            <i className="ti ti-xbox-x" />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="my-3">
                  <Link href="#" className="label-add link-primary add-new-product">
                    <i className="ti ti-plus me-1" />
                    Add New
                  </Link>
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3 fw-semibold">
                      Subtotal<span>$0</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3 fw-semibold">
                      Tax<span>$0</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between fw-semibold">
                      Total<span>$0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={3} />
                </div>
              </div>
              <div className="col-md-12">
                <div>
                  <label className="form-label">Terms &amp; Conditions</label>
                  <textarea className="form-control" rows={3} />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <div className="d-flex align-items-center gap-2">
                <button type="submit" className="btn btn-dark">
                  Save
                </button>
                <button type="button" className="btn btn-primary">
                  Save &amp; Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* /Add Canvas */}
      {/* Edit Canvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="edit-offcanvas"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Edit Quotation</h5>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="form-label">Client</label>
                    <Link
                      href="#"
                      className="label-add link-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_client"
                    >
                      <i className="ti ti-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <select className="select" defaultValue="NovaWave LLC">
                    {QuotationClientOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" name="amount" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <select className="select" defaultValue="Dollar">
                    {QuotationCurrencyOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Valid Till</label>
                  <div className="input-group w-auto input-group-flat">
                    <CommonDatePicker placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <div className="editor custom-editor">
                    <TextEditor />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="table-responsive custom-table table-nowrap">
                  <table className="table table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Amount</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="product-list">
                        <td className="product-select">
                          <select
                            className="select"
                            defaultValue="CRM License Pro"
                          >
                            {QuotationEditProductOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" defaultValue="5" />
                        </td>
                        <td>
                          <input className="form-control" defaultValue="$200" />
                        </td>
                        <td>
                          <select className="select" defaultValue="10 %">
                            {QuotationEditDiscountOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" defaultValue="$900" />
                        </td>
                        <td />
                      </tr>
                      <tr className="product-list">
                        <td className="product-select">
                          <select className="form-control" name="line_product">
                            <option value="">Select</option>
                            {catalog.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                            {QuotationProductOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" name="line_qty" />
                        </td>
                        <td>
                          <input className="form-control" name="line_price" />
                        </td>
                        <td>
                          <select className="select">
                            {QuotationDiscountOptions.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input className="form-control" />
                        </td>
                        <td>
                          <Link href="#" className="text-danger remove-product">
                            <i className="ti ti-xbox-x" />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="my-3">
                  <Link href="#" className="label-add link-primary add-new-product">
                    <i className="ti ti-plus me-1" />
                    Add New
                  </Link>
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3 fw-semibold">
                      Subtotal<span>$1,470</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3 fw-semibold">
                      Discount 2%<span>$29.40</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3 fw-semibold">
                      Tax<span>$115.22</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between fw-semibold">
                      Total<span>$1,555.82</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    defaultValue="Add any additional details, comments, or special instructions about this invoice for internal reference or client clarification."
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div>
                  <label className="form-label">Terms &amp; Conditions</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    defaultValue="Specify payment terms, conditions, or legal disclaimers applicable to this invoice to ensure clarity and mutual understanding."
                  />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <div className="d-flex align-items-center gap-2">
                <button type="submit" className="btn btn-dark">
                  Save
                </button>
                <button type="button" className="btn btn-primary">
                  Save &amp; Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Edit Canvas */}
      {/* add client */}
      <div className="modal custom-modal fade" id="add_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Add Client</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="input-icon-start input-icon position-relative">
                    <span className="input-icon-addon fs-12">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-md"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <ul className="mb-0">
                  {QuotationClientPickList.map((client, index) => (
                    <li
                      className={
                        index === QuotationClientPickList.length - 1
                          ? "mb-0"
                          : "mb-2"
                      }
                      key={client.key}
                    >
                      <label className="dropdown-item px-2 d-flex align-items-center">
                        <input
                          className="form-check-input m-0 me-1"
                          type="checkbox"
                        />
                        <span className="avatar avatar-xs rounded-circle me-2">
                          <ImageWithBasePath
                            src={client.image}
                            className="flex-shrink-0 rounded-circle"
                            alt="img"
                          />
                        </span>
                        {client.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-btn text-end p-3 border-top">
                <Link href="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* add client */}
      {/* delete modal */}
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
                Are you sure you want to remove quotation you selected.
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
      {/* delete modal */}
    </>
  );
};

export default ModalQuotations;
