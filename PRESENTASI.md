# 🏆 Aplikasi Pendaftaran Turnamen
### Tes Web Developer - Fauziah Rahma Nadin

---

## 👩‍💻 Identitas
| | |
|---|---|
| **Nama** | Fauziah Rahma Nadin |
| **Email** | fzhnadin@gmail.com |
| **Posisi** | Web Developer |

---

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi | Keterangan |
|--------|-----------|------------|
| Antarmuka | React.js (Vite) | Tampilan aplikasi web |
| Server | Laravel 11 (PHP) | REST API |
| Basis Data | PostgreSQL | Penyimpanan data |
| Autentikasi | Laravel Sanctum | Token Akses Pribadi |
| Hosting Antarmuka | Vercel | Deploy aplikasi React |
| Hosting Server | Railway | Deploy API Laravel |
| Basis Data Cloud | Supabase | PostgreSQL cloud |
| Kode Sumber | GitHub | Kontrol versi |

---

## 🌐 Tautan Akses

| | URL |
|---|---|
| **Situs Web** | https://tugas-clavis.vercel.app |
| **Repositori** | https://github.com/fauziahRN/Tugas_Clavis.git |
| **Server API** | https://tugasclavis-production-3607.up.railway.app |

---

## 📋 Fitur yang Dibuat

### 1. ✅ Halaman Daftar Akun
- Formulir pendaftaran dengan kolom:
  Nama Lengkap, Nama Pengguna, Email,
  Kata Sandi, Nomor Telepon
- Validasi di sisi klien dan sisi server
- Nama Pengguna harus unik, hanya huruf dan angka
- Kata Sandi 8-16 karakter
- Nomor Telepon harus angka (11-13 digit)
- Diarahkan ke halaman Masuk setelah berhasil

### 2. ✅ Halaman Masuk
- Validasi nama pengguna (6-15 karakter, huruf dan angka)
- Validasi kata sandi (8-16 karakter)
- Fitur "Ingat Saya" (localStorage vs sessionStorage)
- Fitur "Lupa Kata Sandi?" dengan reset kata sandi
- Sesi menggunakan Bearer Token Laravel Sanctum
- Langsung diarahkan ke halaman Selesai jika sudah daftar tim

### 3. ✅ Halaman Pendaftaran Turnamen Tim
- Halaman terlindungi (harus masuk terlebih dahulu)
- Formulir data tim: Nama Tim, Kapten Tim, Anggota Tim
- Nama dan Nomor Telepon kapten terisi otomatis dari sesi
- Validasi Nama Tim (4-15 karakter, huruf+angka+garis bawah, unik)
- Validasi Jenis Kelamin (Pria/Wanita)
- Munculan Aturan dan Regulasi Turnamen
- Data tersimpan ke basis data PostgreSQL

### 4. ✅ Halaman Pendaftaran Selesai
- Menampilkan pesan "Pendaftaran Berhasil!"
- Jika pengguna sudah daftar tim → langsung diarahkan ke halaman ini
- Tombol Keluar

### 5. ✅ Keluar
- Hapus token dari localStorage/sessionStorage
- Cabut token di server
- Diarahkan ke halaman Masuk

### 6. ✅ Reset Kata Sandi
- Fitur lupa kata sandi
- Email terisi otomatis dari nama pengguna yang diketik
- Tautan reset kata sandi ditampilkan
- Halaman reset kata sandi dengan validasi

---

## 🔌 Titik Akses REST API

### URL Dasar
