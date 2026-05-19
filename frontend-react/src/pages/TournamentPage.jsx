import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import RulesModal from '../components/RulesModal.jsx';

const teamRegex = /^[a-zA-Z0-9_]{4,15}$/;
const nameRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^[0-9]{7,14}$/;

function TournamentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', phone_number: '' });
  const [teamName, setTeamName] = useState('');
  const [captainGender, setCaptainGender] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberGender, setMemberGender] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    api.get('/tournament/status')
      .then(response => {
        if (response.data.registered === true) {
          navigate('/finish');
        }
      })
      .catch(() => {});
  }, [navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!teamName || !teamRegex.test(teamName)) {
      nextErrors.teamName =
        'Nama tim 4-15 karakter, hanya huruf, angka, dan underscore';
    }

    if (!user.name || !nameRegex.test(user.name)) {
      nextErrors.captainName = 'Nama lengkap kapten tidak valid';
    }

    if (!user.phone_number || !phoneRegex.test(user.phone_number)) {
      nextErrors.captainPhone = 'Nomor telepon kapten tidak valid';
    }

    if (!captainGender) {
      nextErrors.captainGender = 'Pilih jenis kelamin kapten';
    }

    if (!memberName || !nameRegex.test(memberName)) {
      nextErrors.memberName = 'Nama anggota tidak valid';
    }

    if (!memberPhone || !phoneRegex.test(memberPhone)) {
      nextErrors.memberPhone = 'Nomor telepon anggota tidak valid';
    }

    if (!memberGender) {
      nextErrors.memberGender = 'Pilih jenis kelamin anggota';
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
      await api.post('/tournament/register', {
        team_name: teamName,
        captain_name: user.name,
        captain_phone: user.phone_number,
        captain_gender: captainGender,
        member_name: memberName,
        member_phone: memberPhone,
        member_gender: memberGender,
      });

      navigate('/finish');
    } catch (error) {
      if (error.response?.status === 409) {
        navigate('/finish');
        return;
      }

      setSubmitError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Terjadi kesalahan saat mendaftar tim',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore logout errors
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const sInput = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    background: '#FFFFFF',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const sInputPrefilled = {
    ...sInput,
    background: '#E9ECEF',
    color: '#495057',
    border: '1px solid #DEE2E6',
    cursor: 'default',
  };

  const sLabel = {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
    display: 'block',
  };

  const sFieldGroup = { marginBottom: '14px' };

  const sError = { color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' };
  const sDivider = { border: 'none', borderTop: '1px solid #DEE2E6', margin: '20px 0' };
  const sSelect = { ...sInput, color: '#6B7280', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', padding: '20px' }}>
      <div style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#EF4444',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '40px 48px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '6px' }}>
          Pendaftaran Turnamen Tim
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '28px' }}>
          Isi data tim Anda untuk mendaftar.
        </p>

        <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '28px 32px', background: '#F8F9FA' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '20px' }}>
            Data Tim
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Nama Tim */}
            <div style={sFieldGroup}>
              <label htmlFor="teamName" style={sLabel}>Nama Tim</label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Masukkan nama tim"
                style={sInput}
              />
              {errors.teamName && <span style={sError}>{errors.teamName}</span>}
            </div>

            <hr style={sDivider} />

            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px', marginTop: '4px' }}>
              Kapten Tim
            </h3>

            <div style={sFieldGroup}>
              <label htmlFor="captainName" style={sLabel}>Nama Lengkap</label>
              <input
                id="captainName"
                type="text"
                value={user.name}
                onChange={(event) => setUser((prev) => ({ ...prev, name: event.target.value }))}
                style={sInputPrefilled}
              />
              {errors.captainName && <span style={sError}>{errors.captainName}</span>}
            </div>

            <div style={sFieldGroup}>
              <label htmlFor="captainPhone" style={sLabel}>Nomor Telepon</label>
              <input
                id="captainPhone"
                type="text"
                value={user.phone_number}
                onChange={(event) => setUser((prev) => ({ ...prev, phone_number: event.target.value }))}
                style={sInputPrefilled}
              />
            </div>

            <div style={sFieldGroup}>
              <label htmlFor="captainGender" style={sLabel}>Jenis Kelamin</label>
              <select
                id="captainGender"
                value={captainGender}
                onChange={(event) => setCaptainGender(event.target.value)}
                style={{ ...sSelect, color: captainGender ? '#111827' : '#6B7280' }}
              >
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
              {errors.captainGender && <span style={sError}>{errors.captainGender}</span>}
            </div>

            <hr style={sDivider} />

            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '12px', marginTop: '4px' }}>
              Anggota Tim
            </h3>

            <div style={sFieldGroup}>
              <label htmlFor="memberName" style={sLabel}>Nama Lengkap</label>
              <input
                id="memberName"
                type="text"
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                placeholder="Masukkan nama anggota"
                style={sInput}
              />
              {errors.memberName && <span style={sError}>{errors.memberName}</span>}
            </div>

            <div style={sFieldGroup}>
              <label htmlFor="memberPhone" style={sLabel}>Nomor Telepon</label>
              <input
                id="memberPhone"
                type="text"
                inputMode="numeric"
                value={memberPhone}
                onChange={(event) => setMemberPhone(event.target.value)}
                placeholder="Masukkan nomor telepon anggota"
                style={sInput}
              />
              {errors.memberPhone && <span style={sError}>{errors.memberPhone}</span>}
            </div>

            <div style={sFieldGroup}>
              <label htmlFor="memberGender" style={sLabel}>Jenis Kelamin</label>
              <select
                id="memberGender"
                value={memberGender}
                onChange={(event) => setMemberGender(event.target.value)}
                style={{ ...sSelect, color: memberGender ? '#111827' : '#6B7280' }}
              >
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
              {errors.memberGender && <span style={sError}>{errors.memberGender}</span>}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setIsRulesOpen(true)}
                style={{ background: 'none', border: 'none', color: '#4F6AF5', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Baca Aturan &amp; Regulasi Turnamen
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: '#7C3AED', color: 'white', fontSize: '16px', fontWeight: '700', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Loading...' : 'Daftarkan Tim'}
            </button>

            {submitError && <span style={{ ...sError, marginTop: '8px' }}>{submitError}</span>}
          </form>
        </div>
      </div>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}

export default TournamentPage;
