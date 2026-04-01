import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import productDetailApi from "../../../api/productDetailApi";
import productApi from "../../../api/productApi";
import categoryApi from "../../../api/cateProduct";

/* ── Icons ── */
const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEdit  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ──────────────────────────────────────────
   ProductDetail Modal (Thêm / Sửa)
   Create: productId (dropdown) + cateId + description
   Edit:   cateId + description (productId cố định)
─────────────────────────────────────────── */
const ProductDetailModal = ({ isOpen, onClose, onSubmit, initialData, products, categories }) => {
  const isEditing = !!initialData;
  const [form, setForm]         = useState({ productId: "", cateId: "", description: "" });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setForm(
      initialData
        ? { productId: initialData.productId ?? "", cateId: initialData.cateId ?? "", description: initialData.description || "" }
        : { productId: "", cateId: "", description: "" }
    );
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!isEditing && !form.productId) e.productId = "Vui lòng chọn sản phẩm";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSubmit({
        productId: form.productId !== "" ? Number(form.productId) : undefined,
        cateId:    form.cateId    !== "" ? Number(form.cateId)    : null,
        description: form.description.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Chỉnh sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Sản phẩm — chỉ hiện khi thêm mới */}
            {!isEditing ? (
              <div className="field">
                <label htmlFor="pd-product" className="field-label">
                  Sản phẩm <span className="req">*</span>
                </label>
                <select
                  id="pd-product"
                  name="productId"
                  className={`field-input${errors.productId ? " is-error" : ""}`}
                  value={form.productId}
                  onChange={handleChange}
                  autoFocus
                >
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>{p.productName}</option>
                  ))}
                </select>
                {errors.productId && <span className="field-error">⚠ {errors.productId}</span>}
              </div>
            ) : (
              <div className="field">
                <label className="field-label">Sản phẩm</label>
                <div className="field-readonly">{initialData?.productName}</div>
              </div>
            )}

            {/* Danh mục */}
            <div className="field">
              <label htmlFor="pd-cate" className="field-label">Danh mục</label>
              <select
                id="pd-cate"
                name="cateId"
                className="field-input"
                value={form.cateId}
                onChange={handleChange}
              >
                <option value="">— Chọn danh mục —</option>
                {categories.map((c) => (
                  <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
                ))}
              </select>
            </div>

            {/* Mô tả */}
            <div className="field">
              <label htmlFor="pd-description" className="field-label">Mô tả</label>
              <textarea
                id="pd-description"
                name="description"
                className="field-input field-textarea"
                placeholder="Nhập mô tả chi tiết..."
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Đang lưu…" : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────
   ProductDetailManager
─────────────────────────────────────────── */
const ProductDetailManager = () => {
  const [details, setDetails]     = useState([]);
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  /* ── Load all ── */
  const loadDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productDetailApi.getAll();
      setDetails(Array.isArray(res) ? res : res.items || []);
    } catch {
      toast.error("Không thể tải dữ liệu chi tiết!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDetails();

    // Load products (lấy tất cả, pageSize lớn)
    productApi.getAll({ pageNumber: 1, pageSize: 200 })
      .then((res) => setProducts(res.items || []))
      .catch(console.error);

    categoryApi.getAll()
      .then((res) => setCategories(Array.isArray(res) ? res : res.items || []))
      .catch(console.error);
  }, [loadDetails]);

  /* ── CRUD ── */
  const handleCreate = async (data) => {
    await productDetailApi.create(data);
    toast.success("Thêm chi tiết sản phẩm thành công!");
    loadDetails();
  };

  const handleUpdate = async (data) => {
    await productDetailApi.update(editItem.productId, {
      cateId: data.cateId,
      description: data.description,
    });
    toast.success("Cập nhật thành công!");
    loadDetails();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productDetailApi.delete(deleteTarget.productId);
      toast.success("Đã xóa chi tiết sản phẩm!");
      loadDetails();
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const openAdd  = ()  => { setEditItem(null);  setModalOpen(true); };
  const openEdit = (d) => { setEditItem(d);      setModalOpen(true); };
  const onSubmit = (data) => editItem ? handleUpdate(data) : handleCreate(data);

  // Client-side search
  const filtered = details.filter((d) =>
    d.productName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    d.cateName?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Chi tiết sản phẩm</h1>
          <p className="page-subtitle">
            {details.length > 0 ? `${details.length} chi tiết` : "Chưa có dữ liệu"}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-add-detail">
          <IconPlus /> Thêm chi tiết
        </button>
      </div>

      {/* Search */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="search-detail"
            className="search-input"
            type="text"
            placeholder="Tìm theo tên máy hoặc danh mục..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-scroll">
          {loading ? (
            <div className="state-box">
              <div className="spinner" />
              <p className="state-text">Đang tải...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">📋</div>
              <p className="state-text">Không có dữ liệu chi tiết</p>
              <p className="state-hint">
                {searchInput ? `Không tìm thấy "${searchInput}"` : "Hãy thêm chi tiết sản phẩm đầu tiên!"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th>Tên máy</th>
                  <th>Danh mục</th>
                  <th>Mô tả</th>
                  <th className="col-actions">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.productId}>
                    <td className="col-id">#{d.productId}</td>
                    <td style={{ fontWeight: 600 }}>{d.productName}</td>
                    <td>
                      {d.cateName
                        ? <span className="badge">{d.cateName}</span>
                        : <span className="badge badge-empty">—</span>}
                    </td>
                    <td style={{ color: d.description ? "inherit" : "var(--text-muted)", maxWidth: 280 }}>
                      <span className="td-description">{d.description || "—"}</span>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button
                          id={`btn-edit-detail-${d.productId}`}
                          className="btn btn-sm btn-ghost"
                          onClick={() => openEdit(d)}
                        >
                          <IconEdit /> Sửa
                        </button>
                        <button
                          id={`btn-delete-detail-${d.productId}`}
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteTarget(d)}
                        >
                          <IconTrash /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Hiển thị {filtered.length} / {details.length} chi tiết
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        initialData={editItem}
        products={products}
        categories={categories}
      />

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <div className="confirm-icon">🗑️</div>
            </div>
            <div className="confirm-content">
              <h3 className="confirm-title">Xác nhận xóa</h3>
              <p className="confirm-desc">
                Bạn có chắc muốn xóa chi tiết của{" "}
                <strong>"{deleteTarget.productName}"</strong>?
              </p>
            </div>
            <div className="confirm-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Hủy</button>
              <button
                id={`btn-confirm-delete-detail-${deleteTarget.productId}`}
                className="btn btn-danger-solid"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Đang xóa…" : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailManager;
