import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    const e = params.get('email');
    if (!t || !e) {
      navigate('/login');
      return;
    }
    setToken(t);
    setEmail(e);
  }, []);

  const validate = () => {
    let valid = true;
    setPasswordError('');
    setConfirmError('');

    if (password.length < 8 || password.length > 16) {
      setPasswordError('Password harus 8-16 karakter');
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmError('Password tidak sama');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await api.post('/auth/reset-password', { token, email, password });
      setSuccessMessage('Password berhasil direset! Mengalihkan ke login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', color: '#111827', marginBottom: '8px' }}>
          Reset Kata Sandi
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '28px' }}>
          Masukkan password baru Anda
        </p>

        {successMessage && (
          <p style={{ color: '#22C55E', fontSize: '14px', textAlign: 'center', marginBottom: '16px', fontWeight: '600' }}>
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
            {errorMessage}
          </p>
        )}

        <div style={{ marginBottom: '20px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
            Password Baru
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 42px 10px 14px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
              lineHeight: '1',
              padding: '0',
              margin: '0'
            }}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                   viewBox="0 0 24 24" fill="none" stroke="#6B7280"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                   viewBox="0 0 24 24" fill="none" stroke="#6B7280"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </span>
          {passwordError && (
            <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {passwordError}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '24px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
            Konfirmasi Password
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 42px 10px 14px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
              lineHeight: '1',
              padding: '0',
              margin: '0'
            }}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                   viewBox="0 0 24 24" fill="none" stroke="#6B7280"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                   viewBox="0 0 24 24" fill="none" stroke="#6B7280"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </span>
          {confirmError && (
            <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {confirmError}
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? '#93C5FD' : '#4F6AF5', color: 'white', fontSize: '16px', fontWeight: '700', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Loading...' : 'Reset Password'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#4F6AF5', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Kembali ke Login
          </button>
        </p>
      </div>
    </div>
  );
}
