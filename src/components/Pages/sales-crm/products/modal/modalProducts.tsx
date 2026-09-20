"use client";
import Link from "next/link";
import { createCatalogItem, moveStock, parseAmount, readForm, closeBootstrapChrome } from "@/lib/crm";

type ModalProductsProps = { onSaved?: () => void; selectedId?: string | null };

const ModalProducts = ({ onSaved, selectedId }: ModalProductsProps) => {
  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const vals = readForm(e.currentTarget);
      await createCatalogItem({
        name: vals.name || "Article",
        sku: vals.sku || null,
        category: vals.category || null,
        unit_price: parseAmount(vals.unit_price),
        tax_rate: parseAmount(vals.tax_rate) || 20,
        description: vals.description || null,
        opening_stock: parseAmount(vals.stock_qty),
      });
      onSaved?.();
      closeBootstrapChrome(e.currentTarget);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const onEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const vals = readForm(e.currentTarget);
      const qty = parseAmount(vals.stock_move);
      if (selectedId && qty) {
        await moveStock({
          catalog_item_id: selectedId,
          qty: -Math.abs(qty),
          reason: "mouvement catalogue",
        });
      }
      onSaved?.();
      closeBootstrapChrome(e.currentTarget);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <>
      {/* Add Product */}
      <div className="modal custom-modal fade" id="add_product" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Create New Product</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={onCreate}>
              <div className="modal-body">
                {/* Start row */}
                <div className="row row-gap-3">
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="name" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select className="form-control" name="category">
                        <option value="">Select Category</option>
                        <option>Hardware</option>
                        <option>Cloud</option>
                        <option>Security</option>
                        <option>Marketing</option>
                        <option>Finance</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows={4} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        SKU <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="sku" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Cost Price <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="stock_qty" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="unit_price" />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Tax % <span className="text-danger">*</span>
                      </label>
                      <select className="form-control" name="tax_rate">
                        <option value="20">20</option>
                        <option>18</option>
                        <option>16</option>
                        <option>12</option>
                        <option>6</option>
                        <option>4</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center gap-2 felx-grow-1 w-100 justify-content-end">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-light"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create New
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Add Product */}
      {/* Edit Product */}
      <div className="modal custom-modal fade" id="edit_product" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mb-0">Edit Product</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={onEdit}>
              <div className="modal-body">
                <div className="row row-gap-3">
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Barcode Scanner"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className="select2"
                        data-toggle="select2"
                        defaultValue="Cloud"
                      >
                        <option>Select Category</option>
                        <option>Hardware</option>
                        <option>Cloud</option>
                        <option>Security</option>
                        <option>Marketing</option>
                        <option>Finance</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows={4} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        SKU * <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="BARHARD"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Cost Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="stock_move"
                        defaultValue="8956"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div>
                      <label className="form-label">
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="7500"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <label className="form-label">
                        Tax % <span className="text-danger">*</span>
                      </label>
                      <select
                        className="select2"
                        data-toggle="select2"
                        defaultValue="16"
                      >
                        <option>Select</option>
                        <option>18</option>
                        <option>16</option>
                        <option>12</option>
                        <option>6</option>
                        <option>4</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* End row */}
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center gap-2 felx-grow-1 w-100 justify-content-end">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-light"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create New
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Product */}
      {/* delete modal */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered modal-sm rounded-0">
          <div className="modal-content">
            <div className="modal-body p-4 text-center position-relative">
              <div className="mb-3 position-relative z-1">
                <span className="avatar avatar-xl badge-soft-danger border-0 text-danger rounded-circle">
                  <i className="ti ti-trash fs-24" />
                </span>
              </div>
              <h5 className="mb-1">Delete Confirmation</h5>
              <p className="mb-3">
                Are you sure you want to remove product you selected.
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

export default ModalProducts;
