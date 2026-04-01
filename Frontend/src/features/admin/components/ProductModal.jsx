import React, { useState, useEffect } from "react";

/**
 * ProductModal
 * Props:
 *  - isOpen       : boolean
 *  - onClose      : () => void
 *  - onSubmit     : (data) => Promise<void>
 *  - initialData  : object | null  — null = Thêm mới
 *  - categories   : [{ cateId, cateName }]
 */
const ProductModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const isEditing = !!initialData;

  const [form, setForm] = useState({ productName: "", productType: "", cateId: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setForm(
      initialData
        ? {
            productName: initialData.productName || "",
            productType: initialData.productType || "",
            cateId: initialData.cateId ?? "",
          }
        : { productName: "", productType: "", cateId: "" }
    );
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = "Tên máy không được để trống";
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
        productName: form.productName.trim(),
        productType: form.productType.trim(),
        cateId: form.cateId !== "" ? Number(form.cateId) : null,
      });
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* ── Header ── */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Tên máy */}
            <div className="field">
              <label htmlFor="pm-name" className="field-label">
                Tên máy <span className="req">*</span>
              </label>
              <input
                id="pm-name"
                name="productName"
                type="text"
                className={`field-input${errors.productName ? " is-error" : ""}`}
                placeholder="Nhập tên máy dập..."
                value={form.productName}
                onChange={handleChange}
                autoFocus
              />
              {errors.productName && (
                <span className="field-error">⚠ {errors.productName}</span>
              )}
            </div>

            {/* Loại máy */}
            <div className="field">
              <label htmlFor="pm-type" className="field-label">Loại máy</label>
              <input
                id="pm-type"
                name="productType"
                type="text"
                className="field-input"
                placeholder="VD: Máy dập thủy lực, máy dập cơ..."
                value={form.productType}
                onChange={handleChange}
              />
            </div>

            {/* Danh mục */}
            <div className="field">
              <label htmlFor="pm-cate" className="field-label">Danh mục</label>
              <select
                id="pm-cate"
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

          </div>

          {/* ── Footer ── */}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Đang lưu…" : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;
