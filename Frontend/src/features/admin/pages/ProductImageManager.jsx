import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import productImageApi from "../../../api/productImageApi";
import productApi from "../../../api/productApi";

/* ── Icons ── */
const IconSearch       = () => <span style={{ fontSize: 15 }}>🔍</span>;
const IconPlus         = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEdit         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash        = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconSort         = ({ active, dir }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--accent)" : "var(--text-muted)"} strokeWidth="2.5" strokeLinecap="round">
    {dir === "asc" ? <><polyline points="18 15 12 9 6 15"/></> : <><polyline points="6 9 12 15 18 9"/></>}
  </svg>
);

/* ──────────────────────────────────────
   ProductImage Modal (Thêm / Sửa)
─────────────────────────────────────── */
const ProductImageModal = ({ isOpen, onClose, onSubmit, initialData, products }) => {
  const isEditing = !!initialData;
  const [form, setForm]         = useState({ productId: "", imageUrl: "" });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setForm(
      initialData
        ? { productId: initialData.productId ?? "", imageUrl: initialData.imageUrl ?? "" }
        : { productId: "", imageUrl: "" }
    );
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!isEditing && !form.productId) e.productId = "Vui lòng chọn sản phẩm";
    if (!form.imageUrl.trim())          e.imageUrl  = "URL ảnh không được trống";
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
        imageUrl:  form.imageUrl.trim(),
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
            {isEditing ? "Chỉnh sửa ảnh sản phẩm" : "Thêm ảnh sản phẩm"}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Sản phẩm */}
            {!isEditing ? (
              <div className="field">
                <label htmlFor="pi-product" className="field-label">
                  Sản phẩm <span className="req">*</span>
                </label>
                <select
                  id="pi-product"
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

            {/* URL ảnh */}
            <div className="field">
              <label htmlFor="pi-imageurl" className="field-label">
                URL ảnh <span className="req">*</span>
              </label>
              <input
                id="pi-imageurl"
                name="imageUrl"
                type="text"
                className={`field-input${errors.imageUrl ? " is-error" : ""}`}
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
              />
              {errors.imageUrl && <span className="field-error">⚠ {errors.imageUrl}</span>}
            </div>

            {/* Preview */}
            {form.imageUrl.trim() && (
              <div className="field">
                <label className="field-label">Xem trước</label>
                <div style={{ marginTop: 6 }}>
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    onError={(e) => { e.target.style.display = "none"; }}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 180,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      objectFit: "contain",
                      background: "#f8f8f8",
                    }}
                  />
                </div>
              </div>
            )}

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

/* ──────────────────────────────────────
   ProductImageManager
─────────────────────────────────────── */
const ProductImageManager = () => {
  const [images, setImages]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [meta, setMeta]           = useState({ totalPages: 0, totalCount: 0 });

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    productId: "",
    sortBy: "id",
    sortDir: "desc",
  });

  const [modalOpen, setModalOpen]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  /* ── Load images ── */
  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: filters.pageNumber,
        pageSize:   filters.pageSize,
        searchTerm: filters.searchTerm || undefined,
        productId:  filters.productId  || undefined,
        sortBy:     filters.sortBy,
        sortDir:    filters.sortDir,
      };
      const res = await productImageApi.getAll(params);
      setImages(res.items || []);
      setMeta({ totalPages: res.totalPages || 0, totalCount: res.totalCount || 0 });
    } catch {
      toast.error("Không thể tải danh sách ảnh sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* ── Load products (once) ── */
  useEffect(() => {
    productApi.getAll({ pageNumber: 1, pageSize: 200 })
      .then((res) => setProducts(res.items || []))
      .catch(console.error);
  }, []);

  /* ── Debounce search 500ms ── */
  useEffect(() => {
    const t = setTimeout(() =>
      setFilters((p) => ({ ...p, searchTerm: searchInput, pageNumber: 1 })), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ── Fetch on filters change ── */
  useEffect(() => { loadImages(); }, [loadImages]);

  /* ── Sorting toggle ── */
  const toggleSort = (col) => {
    setFilters((p) => ({
      ...p,
      sortBy: col,
      sortDir: p.sortBy === col && p.sortDir === "desc" ? "asc" : "desc",
      pageNumber: 1,
    }));
  };

  /* ── CRUD ── */
  const handleCreate = async (data) => {
    await productImageApi.create(data);
    toast.success("Thêm ảnh thành công!");
    setFilters((p) => ({ ...p, pageNumber: 1 }));
  };

  const handleUpdate = async (data) => {
    await productImageApi.update(editItem.id, { imageUrl: data.imageUrl });
    toast.success("Cập nhật ảnh thành công!");
    loadImages();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productImageApi.delete(deleteTarget.id);
      toast.success("Đã xóa ảnh!");
      if (images.length === 1 && filters.pageNumber > 1)
        setFilters((p) => ({ ...p, pageNumber: p.pageNumber - 1 }));
      else loadImages();
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const openAdd  = ()  => { setEditItem(null);  setModalOpen(true); };
  const openEdit = (d) => { setEditItem(d);      setModalOpen(true); };
  const onSubmit = (d) => editItem ? handleUpdate(d) : handleCreate(d);
  const goPage   = (n) => setFilters((p) => ({ ...p, pageNumber: n }));

  /* ── Pagination ── */
  const buildPages = () => {
    const cur   = filters.pageNumber;
    const total = meta.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (cur > 3) pages.push("…");
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push("…");
    pages.push(total);
    return pages;
  };

  const SortBtn = ({ col, label }) => (
    <span
      style={{ cursor: "pointer", userSelect: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
      onClick={() => toggleSort(col)}
    >
      {label}
      <IconSort active={filters.sortBy === col} dir={filters.sortDir} />
    </span>
  );

  /* ── Render ── */
  return (
    <div className="page-wrapper">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ảnh sản phẩm</h1>
          <p className="page-subtitle">
            {meta.totalCount > 0 ? `${meta.totalCount} ảnh trong hệ thống` : "Chưa có ảnh nào"}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-add-image">
          <IconPlus /> Thêm ảnh
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><IconSearch /></span>
          <input
            id="search-image"
            className="search-input"
            type="text"
            placeholder="Tìm theo URL hoặc tên sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          id="filter-product"
          className="filter-select"
          value={filters.productId}
          onChange={(e) => setFilters((p) => ({ ...p, productId: e.target.value, pageNumber: 1 }))}
        >
          <option value="">Tất cả sản phẩm</option>
          {products.map((p) => (
            <option key={p.productId} value={p.productId}>{p.productName}</option>
          ))}
        </select>

        <select
          id="filter-pagesize"
          className="filter-select"
          value={filters.pageSize}
          onChange={(e) => setFilters((p) => ({ ...p, pageSize: +e.target.value, pageNumber: 1 }))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} / trang</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-scroll">
          {loading ? (
            <div className="state-box">
              <div className="spinner" />
              <p className="state-text">Đang tải dữ liệu...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">🖼️</div>
              <p className="state-text">Không có ảnh nào</p>
              <p className="state-hint">
                {filters.searchTerm
                  ? `Không tìm thấy kết quả cho "${filters.searchTerm}"`
                  : "Hãy thêm ảnh sản phẩm đầu tiên!"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-id"><SortBtn col="id" label="ID" /></th>
                  <th><SortBtn col="productid" label="Sản phẩm" /></th>
                  <th>Xem trước</th>
                  <th><SortBtn col="imageurl" label="URL ảnh" /></th>
                  <th className="col-actions">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={img.id}>
                    <td className="col-id">#{img.id}</td>
                    <td style={{ fontWeight: 600 }}>{img.productName || "—"}</td>
                    <td>
                      <img
                        src={img.imageUrl}
                        alt={img.imageUrl}
                        onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "#f5f5f5",
                          display: "block",
                        }}
                      />
                    </td>
                    <td>
                      <a
                        href={img.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--accent)", fontSize: 13, wordBreak: "break-all", maxWidth: 280, display: "inline-block" }}
                      >
                        {img.imageUrl.length > 60 ? img.imageUrl.slice(0, 60) + "…" : img.imageUrl}
                      </a>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button
                          id={`btn-edit-image-${img.id}`}
                          className="btn btn-sm btn-ghost"
                          onClick={() => openEdit(img)}
                          title="Chỉnh sửa"
                        >
                          <IconEdit /> Sửa
                        </button>
                        <button
                          id={`btn-delete-image-${img.id}`}
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteTarget(img)}
                          title="Xóa"
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

        {/* Pagination */}
        {!loading && meta.totalPages > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Trang <strong>{filters.pageNumber}</strong> / {meta.totalPages}
              &nbsp;·&nbsp;{meta.totalCount} ảnh
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={filters.pageNumber <= 1}
                onClick={() => goPage(filters.pageNumber - 1)}
                aria-label="Trang trước"
              >
                <IconChevronLeft />
              </button>

              {buildPages().map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="page-label">…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn${p === filters.pageNumber ? " active" : ""}`}
                    onClick={() => goPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="page-btn"
                disabled={filters.pageNumber >= meta.totalPages}
                onClick={() => goPage(filters.pageNumber + 1)}
                aria-label="Trang sau"
              >
                <IconChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      <ProductImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        initialData={editItem}
        products={products}
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
                Bạn có chắc muốn xóa ảnh #{deleteTarget.id} của sản phẩm{" "}
                <strong>"{deleteTarget.productName}"</strong>?{" "}
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="confirm-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                id={`btn-confirm-delete-image-${deleteTarget.id}`}
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

export default ProductImageManager;
