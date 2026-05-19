import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FinishPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-shell">
      <div className="finish-card">
        <div className="check-circle">✓</div>
        <h1 className="title">Pendaftaran Berhasil!</h1>
        <p className="finish-subtitle">
          Selamat, tim Anda telah berhasil terdaftar untuk turnamen ini.
        </p>
        <p className="finish-secondary">
          Cek email Anda untuk detail lebih lanjut dan informasi jadwal.
        </p>
        <button type="button" className="button-logout finish-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default FinishPage;
