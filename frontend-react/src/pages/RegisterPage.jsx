import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import InputField from '../components/InputField.jsx';

const usernameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{8,16}$/;
const phoneRegex = /^[0-9]{11,13}$/;

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Nama Lengkap harus diisi';
    }

    if (!username || !usernameRegex.test(username)) {
      nextErrors.username = 'Nama Pengguna harus berisi huruf dan angka saja';
    }

    if (!email || !emailRegex.test(email)) {
      nextErrors.email = 'Email tidak valid';
    }

    if (!password || !passwordRegex.test(password)) {
      nextErrors.password = 'Password harus 8-16 karakter';
    }

    if (!phone || !phoneRegex.test(phone)) {
      nextErrors.phone = 'Nomor telepon harus berupa angka';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        username,
        email,
        password,
        phone_number: phone,
      });

      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Terjadi kesalahan saat pendaftaran';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="title">Buat Akun Baru</h1>
        <p className="subtitle">Daftar sekarang untuk bergabung dengan turnamen kami</p>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Nama Lengkap"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Masukkan nama lengkap"
            error={errors.name}
          />
          <InputField
            label="Nama Pengguna"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Masukkan nama pengguna"
            error={errors.username}
          />
          <InputField
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Masukkan email"
            error={errors.email}
          />
          <div className="field-group" style={{ position: 'relative' }}>
            <label htmlFor="password" className="label">
              Kata Sandi
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
              className="input"
              style={{ padding: '10px 40px 10px 14px' }}
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
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          <InputField
            label="Nomor Telepon"
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Masukkan Nomor Telepon"
            inputMode="numeric"
            error={errors.phone}
          />

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Mendaftar... (mohon tunggu)' : 'Daftar'}
          </button>

          {submitError && <div className="error-text submit-error">{submitError}</div>}
        </form>

        <p className="bottom-text">
          Sudah punya akun?{' '}
          <Link to="/login" className="link-button">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
