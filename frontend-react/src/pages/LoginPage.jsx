import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import InputField from '../components/InputField.jsx';

const usernameRegex = /^[a-zA-Z0-9]{6,15}$/;
const passwordRegex = /^.{8,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [emailHint, setEmailHint] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const nextErrors = {};
    if (!username || !usernameRegex.test(username)) {
      nextErrors.username = 'Username harus 6-15 karakter, hanya huruf dan angka';
    }
    if (!password || !passwordRegex.test(password)) {
      nextErrors.password = 'Password harus 8-16 karakter';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data?.token ?? response.data?.access_token;
      const user = response.data?.user ?? response.data?.data?.user ?? response.data?.user_data;

      if (!token || !user) {
        setSubmitError('Username atau password salah');
        return;
      }

      const userData = JSON.stringify({
        id:           user.id ?? '',
        name:         user.name ?? '',
        username:     user.username ?? '',
        email:        user.email ?? '',
        phone_number: user.phone_number ?? '',
      });

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', userData);
        localStorage.setItem('remembered_username', username);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', userData);
        localStorage.removeItem('remembered_username');
      }

      // Use registered field from login response — no extra API call
      if (response.data.registered === true) {
        navigate('/finish');
      } else {
        navigate('/tournament');
      }
    } catch (error) {
      setSubmitError('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgotModal = async () => {
    setShowForgotModal(true);
    setForgotEmail('');
    setMaskedEmail('');
    setEmailReadOnly(false);
    setEmailHint('');
    setForgotEmailError('');

    if (username && username.length >= 6) {
      try {
        const response = await api.get(`/auth/get-email?username=${username}`);
        if (response.data.email) {
          setForgotEmail(response.data.email);
          setMaskedEmail(response.data.masked_email);
          setEmailReadOnly(true);
          setEmailHint(`Email untuk username "${username}" ditemukan`);
        }
      } catch (_) {
        setEmailHint('Username tidak ditemukan, masukkan email manual');
      }
    }
  };

  const handleForgotSubmit = async () => {
    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError('Format email tidak valid');
      return;
    }
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      setResetUrl(response.data.reset_url);
    } catch (error) {
      setForgotEmailError(
        error.response?.data?.message || 'Email tidak ditemukan'
      );
      return;
    }
    setShowForgotModal(false);
    setForgotEmail('');
    setForgotEmailError('');
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="title">Selamat Datang Kembali</h1>
        <p className="subtitle">Masuk ke akun Anda</p>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Masukkan username"
            error={errors.username}
          />
          <InputField
            label="Kata Sandi"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan kata sandi"
            error={errors.password}
          />

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Ingat saya
            </label>
            <button
              type="button"
              className="text-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onClick={handleOpenForgotModal}
            >
              Lupa kata sandi?
            </button>
          </div>

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Masuk'}
          </button>

          {submitError && <div className="error-text submit-error">{submitError}</div>}
        </form>

        {resetUrl && (
          <div style={{ background: '#F0FDF4', border: '1px solid #22C55E', borderRadius: '8px', padding: '16px', marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: '#166534', fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>
              Link Reset Password:
            </p>
            <a href={resetUrl} style={{ color: '#4F6AF5', fontSize: '13px', wordBreak: 'break-all', textDecoration: 'underline' }}>
              Klik disini untuk reset password
            </a>
          </div>
        )}

        <p className="bottom-text">
          Belum punya akun?{' '}
          <Link to="/register" className="link-button">
            Daftar di sini
          </Link>
        </p>
      </div>

      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Lupa Kata Sandi?</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
              Masukkan email Anda untuk mereset kata sandi
            </p>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            {emailReadOnly ? (
              <input
                type="email"
                value={forgotEmail}
                readOnly
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: '#F3F4F6', color: '#374151', cursor: 'default' }}
              />
            ) : (
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError(''); }}
                placeholder="Masukkan email Anda"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            )}
            {emailReadOnly && maskedEmail && (
              <small style={{ color: '#6B7280', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {maskedEmail}
              </small>
            )}
            {emailHint && (
              <small style={{ color: emailReadOnly ? '#22C55E' : '#EF4444', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {emailHint}
              </small>
            )}
            {forgotEmailError && (
              <span style={{ color: '#EF4444', fontSize: '12px', display: 'block', marginTop: '4px', marginBottom: '4px' }}>
                {forgotEmailError}
              </span>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ flex: 1, padding: '10px 20px', background: 'white', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleForgotSubmit}
                style={{ flex: 1, padding: '10px 20px', background: '#4F6AF5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
