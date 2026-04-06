import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      
      const response = await adminApi.login({ email, password });

      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_info', JSON.stringify(response.admin));

     
      navigate('/admin');
    } catch (err) {
      const message = err.response?.data?.message || 'Kết nối máy chủ thất bại';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, var(--bg) 0%, #e0e7ff 100%)' 
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--sp-8)' }}>
        
        {/* Logo & Header */}
        <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: 'var(--sp-8)' }}>
          <div className="sidebar-logo" style={{ margin: '0 auto var(--sp-4) auto', width: '48px', height: '48px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧪</span>
          </div>
          <h2 className="page-title" style={{ textAlign: 'center', fontSize: '1.5rem' }}>Quản trị Hệ thống</h2>
          <p className="page-subtitle" style={{ textAlign: 'center' }}>Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          
          {/* Email Field */}
          <div className="field">
            <label className="field-label">Email công việc <span className="req">*</span></label>
            <input
              type="email"
              className={`field-input ${error ? 'is-error' : ''}`}
              placeholder="admin@pharmaceuticals.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="field">
            <label className="field-label">Mật khẩu <span className="req">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className={`field-input ${error ? 'is-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {showPassword ? 'ẨN' : 'HIỆN'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="field-error" style={{ 
              background: 'var(--danger-bg)', 
              padding: 'var(--sp-3)', 
              borderRadius: 'var(--r-md)',
              border: '1px solid #fca5a5'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '12px', 
              marginTop: 'var(--sp-2)',
              height: '44px'
            }}
          >
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div> : 'Đăng nhập hệ thống'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 'var(--sp-8)', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-4)' }}>
          <p className="state-hint">
            Quên mật khẩu? Liên hệ quản trị viên IT
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;