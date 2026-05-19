function RulesModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <h2 className="modal-title">Aturan & Regulasi Turnamen</h2>
        <ol className="modal-list">
          <li>Setiap tim terdiri dari 2 orang (1 kapten dan 1 anggota).</li>
          <li>Nama tim harus unik dan belum pernah digunakan.</li>
          <li>Pendaftaran hanya dapat dilakukan sekali per akun.</li>
          <li>Data yang sudah didaftarkan tidak dapat diubah.</li>
          <li>Peserta wajib hadir tepat waktu saat pertandingan berlangsung.</li>
          <li>Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.</li>
        </ol>
        <button type="button" className="button-primary modal-close-button" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export default RulesModal;
