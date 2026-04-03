import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import categoryApi from "../../../api/cateProduct";

/* ── Icons ── */
const IconPlus  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ──────────────────────────────────────────
   AddCategoryModal - chỉ có Create (backend không có PUT)
─────────────────────────────────────────── */
const AddCategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) { setName(""); setError(""); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Tên danh mục không được để trống"); return; }
    setSubmitting(true);
    try {
      await onSubmit({ cateName: name.trim() });
      onClose();
    } catch { } finally { setSubmitting(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">Thêm danh mục mới</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="field">
              <label htmlFor="cate-name" className="field-label">
                Tên danh mục <span className="req">*</span>
              </label>
              <input
                id="cate-name"
                type="text"
                className={`field-input${error ? " is-error" : ""}`}
                placeholder="Nhập tên danh mục..."
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                autoFocus
              />
              {error && <span className="field-error">⚠ {error}</span>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Đang lưu…" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────
   CategoryManager
─────────────────────────────────────────── */
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(Array.isArray(res) ? res : res.items || []);
    } catch {
      toast.error("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleCreate = async (data) => {
    await categoryApi.create(data);
    toast.success("Thêm danh mục thành công!");
    loadCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryApi.delete(deleteTarget.cateId);
      toast.success("Đã xóa danh mục!");
      loadCategories();
    } catch {
      toast.error("Xóa thất bại!");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Client-side search filter
  const filtered = categories.filter((c) =>
    c.cateName?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục</h1>
          <p className="page-subtitle">
            {categories.length > 0 ? `${categories.length} danh mục` : "Chưa có danh mục nào"}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)} id="btn-add-cate">
          <IconPlus /> Thêm danh mục
        </button>
      </div>

      {/* Search */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="search-cate"
            className="search-input"
            type="text"
            placeholder="Tìm danh mục..."
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
              <div className="state-icon">📂</div>
              <p className="state-text">Không có danh mục nào</p>
              <p className="state-hint">
                {searchInput ? `Không tìm thấy "${searchInput}"` : "Hãy thêm danh mục đầu tiên!"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th>Tên danh mục</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.cateId}>
                    <td className="col-id">#{c.cateId}</td>
                    <td style={{ fontWeight: 600 }}>{c.cateName}</td>
                    <td>
                      <button
                        id={`btn-delete-cate-${c.cateId}`}
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteTarget(c)}
                      >
                        <IconTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Count footer */}
        {!loading && filtered.length > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Hiển thị {filtered.length} / {categories.length} danh mục
            </span>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
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
                Bạn có chắc muốn xóa danh mục{" "}
                <strong>"{deleteTarget.cateName}"</strong>?{" "}
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="confirm-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Hủy
              </button>
              <button
                id={`btn-confirm-delete-cate-${deleteTarget.cateId}`}
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

export default CategoryManager;
