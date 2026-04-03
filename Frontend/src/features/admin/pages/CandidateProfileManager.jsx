import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import candidateProfileApi from "../../../api/candidateProfileApi";

const IconSearch  = () => <span style={{fontSize:15}}>🔍</span>;
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;

const CandidateProfileManager = () => {
    const [dataList, setDataList]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [meta, setMeta]           = useState({ totalPages: 0, totalCount: 0 });
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    const [modalOpen, setModalOpen]   = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]     = useState(false);
    const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", resumeUrl: "" });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await candidateProfileApi.getAll(filters);
            setDataList(res.items || []);
            setMeta({ totalPages: res.totalPages || 0, totalCount: res.totalCount || 0 });
        } catch { toast.error("Không thể tải danh sách Hồ sơ ứng viên"); }
        finally { setLoading(false); }
    }, [filters]);

    useEffect(() => {
        const t = setTimeout(() => setFilters((p) => ({ ...p, searchTerm: searchInput, pageNumber: 1 })), 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleUpdate = async () => {
        try {
            await candidateProfileApi.update(editItem.id, formData);
            toast.success("Cập nhật thành công!");
            setModalOpen(false);
            loadData();
        } catch { toast.error("Lỗi khi cập nhật"); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await candidateProfileApi.delete(deleteTarget.id);
            toast.success("Đã xóa hồ sơ!");
            if (dataList.length === 1 && filters.pageNumber > 1) setFilters((p) => ({ ...p, pageNumber: p.pageNumber - 1 }));
            else loadData();
        } catch { toast.error("Xóa thất bại!"); }
        finally { setDeleting(false); setDeleteTarget(null); }
    };

    const openEdit = (item) => { setEditItem(item); setFormData({fullName: item.fullName, phone: item.phone, address: item.address, resumeUrl: item.resumeUrl}); setModalOpen(true); };
    const onSubmit = (e) => { e.preventDefault(); handleUpdate(); };
    const goPage   = (n) => setFilters((p) => ({ ...p, pageNumber: n }));

    const buildPages = () => {
        const { pageNumber: cur } = filters;
        const total = meta.totalPages;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [1];
        if (cur > 3) pages.push("…");
        for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
        if (cur < total - 2) pages.push("…");
        pages.push(total);
        return pages;
    };

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Quản lý Hồ sơ Ứng viên</h1>
                    <p className="page-subtitle">{meta.totalCount > 0 ? `${meta.totalCount} hồ sơ trong hệ thống` : "Chưa có dữ liệu"}</p>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-wrap">
                    <span className="search-icon"><IconSearch /></span>
                    <input className="search-input" type="text" placeholder="Tìm tên, email..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                </div>
                <select className="filter-select" value={filters.pageSize} onChange={(e) => setFilters((p) => ({ ...p, pageSize: +e.target.value, pageNumber: 1 }))}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n} / trang</option>)}
                </select>
            </div>

            <div className="table-container">
                <div className="table-scroll">
                    {loading ? (
                        <div className="state-box"><div className="spinner" /><p className="state-text">Đang tải...</p></div>
                    ) : dataList.length === 0 ? (
                        <div className="state-box"><div className="state-icon">📭</div><p className="state-text">Không có dữ liệu</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="col-id">ID</th>
                                    <th>Họ Tên</th>
                                    <th>Email (User)</th>
                                    <th>SĐT</th>
                                    <th>CV (Link)</th>
                                    <th className="col-actions">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((item) => (
                                    <tr key={item.id}>
                                        <td className="col-id">#{item.id}</td>
                                        <td>{item.fullName}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td><a href={item.resumeUrl} target="_blank" rel="noreferrer">Xem CV</a></td>
                                        <td className="col-actions">
                                            <div className="row-actions">
                                                <button className="btn btn-sm btn-ghost" onClick={() => openEdit(item)}><IconEdit /> Sửa</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(item)}><IconTrash /> Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && meta.totalPages > 0 && (
                    <div className="pagination-bar">
                        <span className="pagination-info">Trang <strong>{filters.pageNumber}</strong> / {meta.totalPages}</span>
                        <div className="pagination-controls">
                            <button className="page-btn" disabled={filters.pageNumber <= 1} onClick={() => goPage(filters.pageNumber - 1)}><IconChevronLeft /></button>
                            {buildPages().map((p, i) => p === "…" ? <span key={i} className="page-label">…</span> : <button key={p} className={`page-btn${p === filters.pageNumber ? " active" : ""}`} onClick={() => goPage(p)}>{p}</button>)}
                            <button className="page-btn" disabled={filters.pageNumber >= meta.totalPages} onClick={() => goPage(filters.pageNumber + 1)}><IconChevronRight /></button>
                        </div>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <h2 className="modal-title">Cập nhật Hồ sơ ứng viên</h2>
                            <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Đóng">✕</button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="field">
                                    <label className="field-label">Họ tên <span className="req">*</span></label>
                                    <input type="text" className="field-input" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} autoFocus placeholder="Nhập họ tên" />
                                </div>
                                <div className="field">
                                    <label className="field-label">Số điện thoại</label>
                                    <input type="text" className="field-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Nhập số điện thoại" />
                                </div>
                                <div className="field">
                                    <label className="field-label">Địa chỉ</label>
                                    <input type="text" className="field-input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nhập địa chỉ" />
                                </div>
                                <div className="field">
                                    <label className="field-label">Link CV (Resume URL)</label>
                                    <input type="text" className="field-input" value={formData.resumeUrl} onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })} placeholder="Nhập link (ví dụ: Google Drive)" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-content">
                            <h3>Xác nhận xóa</h3>
                            <p>Bạn có chắc muốn xóa hồ sơ của <strong>{deleteTarget.fullName}</strong>?</p>
                        </div>
                        <div className="confirm-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Hủy</button>
                            <button className="btn btn-danger-solid" onClick={handleDelete} disabled={deleting}>{deleting ? "Đang xóa…" : "Xóa"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CandidateProfileManager;
