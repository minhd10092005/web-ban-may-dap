import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import productApi from "../../../api/productApi";
import categoryApi from "../../../api/cateProduct";
import ProductModal from "../components/ProductModal";

/* ─────────────────────────────────────────────
   Icon helpers (inline SVG, không cần dep)
───────────────────────────────────────────── */
const IconSearch  = () => <span style={{fontSize:15}}>🔍</span>;
const IconPlus    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;

/* ─────────────────────────────────────────────
   ProductManager
───────────────────────────────────────────── */
const ProductManager = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [meta, setMeta]           = useState({ totalPages: 0, totalCount: 0 });

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    cateId: "",
  });

  const [modalOpen, setModalOpen]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  /* ── Load products ── */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber:  filters.pageNumber,
        pageSize:    filters.pageSize,
        searchTerm:  filters.searchTerm || undefined,
        cateId:      filters.cateId     || undefined,
      };
      const res = await productApi.getAll(params);
      setProducts(res.items || []);
      setMeta({ totalPages: res.totalPages || 0, totalCount: res.totalCount || 0 });
    } catch {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /* ── Load categories (once) ── */
  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(Array.isArray(res) ? res : res.items || []))
      .catch(console.error);
  }, []);

  /* ── Debounce search 500ms ── */
  useEffect(() => {
    const t = setTimeout(() =>
      setFilters((p) => ({ ...p, searchTerm: searchInput, pageNumber: 1 })), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ── Fetch on filters change ── */
  useEffect(() => { loadProducts(); }, [loadProducts]);

  /* ── CRUD ── */
  const handleCreate = async (data) => {
    await productApi.create(data);
    toast.success("Thêm sản phẩm thành công!");
    setFilters((p) => ({ ...p, pageNumber: 1 }));
  };

  const handleUpdate = async (data) => {
    await productApi.update(editProduct.productId, data);
    toast.success("Cập nhật thành công!");
    loadProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productApi.delete(deleteTarget.productId);
      toast.success("Đã xóa sản phẩm!");
      if (products.length === 1 && filters.pageNumber > 1)
        setFilters((p) => ({ ...p, pageNumber: p.pageNumber - 1 }));
      else loadProducts();
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const openAdd  = ()  => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p);    setModalOpen(true); };
  const onSubmit = (d) => editProduct ? handleUpdate(d) : handleCreate(d);
  const goPage   = (n) => setFilters((p) => ({ ...p, pageNumber: n }));

  /* ── Pagination page numbers ── */
  const buildPages = () => {
    const { pageNumber: cur, } = filters;
    const total = meta.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (cur > 3) pages.push("…");
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push("…");
    pages.push(total);
    return pages;
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="page-wrapper">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Máy Dập</h1>
          <p className="page-subtitle">
            {meta.totalCount > 0
              ? `${meta.totalCount} sản phẩm trong hệ thống`
              : "Chưa có sản phẩm nào"}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-add-product">
          <IconPlus /> Thêm sản phẩm
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><IconSearch /></span>
          <input
            id="search-product"
            className="search-input"
            type="text"
            placeholder="Tìm tên máy..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <select
          id="filter-cate"
          className="filter-select"
          value={filters.cateId}
          onChange={(e) => setFilters((p) => ({ ...p, cateId: e.target.value, pageNumber: 1 }))}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.cateId} value={c.cateId}>{c.cateName}</option>
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

      {/* ── Table ── */}
      <div className="table-container">
        <div className="table-scroll">
          {loading ? (
            <div className="state-box">
              <div className="spinner" />
              <p className="state-text">Đang tải dữ liệu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <p className="state-text">Không có dữ liệu</p>
              <p className="state-hint">
                {filters.searchTerm
                  ? `Không tìm thấy kết quả cho "${filters.searchTerm}"`
                  : "Hãy thêm sản phẩm đầu tiên!"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-name">Tên máy</th>
                  <th>Danh mục</th>
                  <th>Loại máy</th>
                  <th className="col-actions">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId}>
                    <td className="col-id">#{p.productId}</td>
                    <td className="col-name">{p.productName}</td>
                    <td>
                      {p.cateName
                        ? <span className="badge">{p.cateName}</span>
                        : <span className="badge badge-empty">—</span>}
                    </td>
                    <td style={{ color: p.productType ? "inherit" : "var(--text-muted)" }}>
                      {p.productType || "—"}
                    </td>
                    <td className="col-actions">
                      <div className="row-actions">
                        <button
                          id={`btn-edit-${p.productId}`}
                          className="btn btn-sm btn-ghost"
                          onClick={() => openEdit(p)}
                          title="Chỉnh sửa"
                        >
                          <IconEdit /> Sửa
                        </button>
                        <button
                          id={`btn-delete-${p.productId}`}
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteTarget(p)}
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

        {/* ── Pagination bar ── */}
        {!loading && meta.totalPages > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Trang <strong>{filters.pageNumber}</strong> / {meta.totalPages}
              &nbsp;·&nbsp;{meta.totalCount} sản phẩm
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

      {/* ── Modal Thêm / Sửa ── */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        initialData={editProduct}
        categories={categories}
      />

      {/* ── Confirm Delete ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <div className="confirm-icon">🗑️</div>
            </div>
            <div className="confirm-content">
              <h3 className="confirm-title">Xác nhận xóa</h3>
              <p className="confirm-desc">
                Bạn có chắc muốn xóa sản phẩm{" "}
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
                id={`btn-confirm-delete-${deleteTarget.productId}`}
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

export default ProductManager;
