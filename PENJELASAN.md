# Penjelasan Lengkap Aplikasi Pendaftaran Turnamen

## 1. Alur Lengkap Aplikasi

### Alur Pendaftaran Akun
1. Pengguna membuka halaman `/register`.
2. `RegisterPage.jsx` memvalidasi input secara klien dengan regex dan persyaratan:
   - Nama lengkap wajib diisi.
   - Nama pengguna hanya huruf dan angka.
   - Email wajib valid.
   - Password 8-16 karakter.
   - Nomor telepon angka 11-13 digit.
3. Jika valid, halaman mengirim permintaan POST ke backend `POST /api/auth/register` melalui `api.js`.
4. Backend `AuthController::register` memvalidasi data server-side dengan Laravel dan membuat entry di tabel `users`.
5. Setelah berhasil, frontend langsung mengarahkan pengguna ke halaman login `/login`.

### Alur Masuk
1. Pengguna membuka `/login`.
2. `LoginPage.jsx` memvalidasi username dan password di sisi klien:
   - Username 6-15 karakter, huruf dan angka.
   - Password 8-16 karakter.
3. Jika valid, dikirim POST ke `POST /api/auth/login`.
4. Backend `AuthController::login` mencari user berdasarkan username, memeriksa hash password, dan membuat token Sanctum dengan `createToken`.
5. Backend memerikan respons berisi `token`, `user`, dan field `registered`.
6. Frontend menyimpan token dan detail user di `localStorage` jika "Ingat saya" aktif, atau `sessionStorage` jika tidak.
7. Jika backend mengembalikan `registered: true`, pengguna diarahkan ke `/finish`; jika tidak, diarahkan ke `/tournament`.

### Alur Pendaftaran Tim Turnamen
1. Halaman `/tournament` dilindungi oleh `ProtectedRoute.jsx` yang memastikan token ada di `localStorage` atau `sessionStorage`.
2. `TournamentPage.jsx` memuat data user dari storage dan memanggil `GET /api/tournament/status` untuk memastikan user belum terdaftar.
3. Jika `status` mengindikasi sudah daftar, pengguna otomatis diarahkan ke `/finish`.
4. Pengguna mengisi form nama tim, informasi kapten, dan anggota tim.
5. Form memvalidasi data secara klien:
   - Nama tim 4-15 karakter, hanya huruf, angka, underscore.
   - Nama anggota dan kapten hanya huruf dan spasi.
   - Nomor telepon hanya angka dan 7-14 digit.
   - Jenis kelamin harus dipilih.
6. Jika valid, frontend mengirim POST ke `POST /api/tournament/register`.
7. Backend `TournamentController::register` memvalidasi server-side dan menyimpan data ke tabel `teams`.
8. Jika berhasil, frontend mengarahkan ke halaman sukses `/finish`.

### Alur Reset Kata Sandi
1. Di halaman login, pengguna dapat menekan "Lupa kata sandi?".
2. `LoginPage.jsx` membuka modal dan mencoba memanggil `GET /api/auth/get-email?username=...` jika username sudah diisi.
3. Jika email ditemukan, modal menampilkan email dan versi ter-mask untuk privasi.
4. Pengguna mengirim permintaan `POST /api/auth/forgot-password` dengan email.
5. Backend `AuthController::forgotPassword` membuat token reset password, menyimpannya di tabel `password_reset_tokens`, dan membangun URL reset dengan parameter `token` dan `email`.
6. Frontend menampilkan `reset_url` yang dapat diklik.
7. Halaman reset password `/reset-password` mengambil parameter query `token` dan `email` dari URL.
8. `ResetPasswordPage.jsx` memvalidasi password baru dan konfirmasi password.
9. Jika valid, frontend mengirim POST ke `/api/auth/reset-password`.
10. Backend `AuthController::resetPassword` memeriksa record token hashed, memperbarui password user, lalu menghapus record token.
11. Setelah sukses, pengguna dialihkan ke halaman login.

### Alur API dengan Token
1. `services/api.js` membuat instance Axios dengan `baseURL` menyesuaikan `VITE_API_URL`.
2. Setiap request menggunakan interceptor untuk menambahkan header `Authorization: Bearer <token>` jika token ditemukan di `localStorage` atau `sessionStorage`.
3. Jika respons backend berstatus 401, interceptor akan menghapus token/user dari storage dan mengarahkan pengguna ke `/login`.
4. Endpoint yang memerlukan autentikasi dikelompokkan dalam `Route::middleware('auth:sanctum')` di `backend-laravel/routes/api.php`.
5. Middleware Laravel `Authenticate` mengembalikan JSON 401 bila permintaan tidak diautentikasi.

## 2. Penjelasan File Frontend (frontend-react)

### `src/App.jsx`
- Fungsi utama: router utama aplikasi.
- Yang ada:
  - Import `BrowserRouter`, `Routes`, `Route`, `Navigate`.
  - Import halaman: `LoginPage`, `RegisterPage`, `TournamentPage`, `FinishPage`, `ResetPasswordPage`.
  - Import `ProtectedRoute`.
- Cara kerjanya:
  - Mengatur route `/login`, `/register`, `/reset-password`, `/tournament`, `/finish`.
  - Halaman `/tournament` dan `/finish` dibungkus `ProtectedRoute` untuk proteksi akses.
  - Route default `"/"` dan `"*"` diarahkan ke `/login`.
- Hubungan:
  - Menghubungkan halaman-halaman React ke URL.
  - Menggunakan `ProtectedRoute.jsx` untuk proteksi dan `api.js` lewat halaman yang memanggil API.

### `src/App.tsx`
- Fungsi utama: file template default Vite/React.
- Yang ada:
  - Komponen demo dengan state `count`, logo React/Vite, hero image, dan link dokumentasi.
- Cara kerjanya:
  - Hanya menampilkan UI template standard tanpa logika aplikasi turnamen.
- Hubungan:
  - `App.tsx` tidak digunakan dalam alur utama karena `main.jsx` mengimpor `App.jsx`.

### `src/main.jsx`
- Fungsi utama: entry point React yang merender aplikasi.
- Yang ada:
  - Import `StrictMode`, `createRoot`, `index.css`, dan `App.jsx`.
  - Memanggil `createRoot(...)` untuk merender `<App />` ke elemen `#root`.
- Cara kerjanya:
  - Inisialisasi React dan memasukkan aplikasi ke DOM.
- Hubungan:
  - Menghubungkan `App.jsx` dengan HTML root.

### `src/main.tsx`
- Fungsi utama: entry point alternatif yang mengimpor file lain.
- Yang ada:
  - Import `index.css` dan `./main.jsx`.
- Cara kerjanya:
  - Memuat `main.jsx` sebagai side-effect, sehingga `main.jsx` akan merender aplikasi.
- Hubungan:
  - Menyertakan `main.jsx` dan CSS global.

### `src/index.css`
- Fungsi utama: styling global aplikasi.
- Yang ada:
  - Reset CSS dasar, tipografi, background, dan style umum.
  - Kelas-kelas seperti `.page-shell`, `.card`, `.button-primary`, `.input`, `.form-row`, `.checkbox-label`, `.text-link`.
- Cara kerjanya:
  - Menerapkan gaya dasar ke seluruh halaman dan komponen form.
- Hubungan:
  - Digunakan oleh `main.jsx` agar seluruh aplikasi mendapat styling dasar.

### `src/App.css`
- Fungsi utama: styling tambahan untuk template Vite.
- Yang ada:
  - Gaya untuk hero, dokumentasi, tombol, logo, dan layout template.
- Cara kerjanya:
  - Didesain untuk `App.tsx` dengan hero grafis dan link dokumentasi.
- Hubungan:
  - Relevan untuk `App.tsx`, bukan untuk alur pendaftaran turnamen yang aktif.

### `src/services/api.js`
- Fungsi utama: konfigurasi Axios untuk komunikasi API.
- Yang ada:
  - `baseURL` dari environment `VITE_API_URL` atau `http://localhost:8000/api`.
  - Header JSON default.
  - Timeout 30 detik.
  - Request interceptor untuk menambahkan token Bearer.
  - Response interceptor untuk menangani status 401.
- Cara kerjanya:
  - Sebelum request dikirim, memeriksa `localStorage`/`sessionStorage` untuk token.
  - Jika ada token, menambahkan `Authorization` header.
  - Jika backend mengembalikan 401, menghapus token/user dan redirect ke `/login`.
- Hubungan:
  - Digunakan oleh semua halaman untuk memanggil endpoint backend.

### `src/components/ProtectedRoute.jsx`
- Fungsi utama: melindungi route React.
- Yang ada:
  - Membaca token dari `localStorage` atau `sessionStorage`.
  - Jika token tidak ada, melakukan `<Navigate to="/login" replace />`.
- Cara kerjanya:
  - Sebagai wrapper untuk komponen `TournamentPage` dan `FinishPage`.
- Hubungan:
  - Digunakan oleh `App.jsx`.

### `src/components/InputField.jsx`
- Fungsi utama: komponen input reusable.
- Yang ada:
  - Label, input, placeholder, error message.
  - Props untuk `type`, `value`, `onChange`, `inputMode`, `readOnly`, `disabled`.
- Cara kerjanya:
  - Menyajikan markup input dan menampilkan pesan kesalahan jika ada.
- Hubungan:
  - Digunakan oleh `RegisterPage.jsx` dan `LoginPage.jsx`.

### `src/components/RulesModal.jsx`
- Fungsi utama: menampilkan modal aturan turnamen.
- Yang ada:
  - Jika `isOpen` false, mengembalikan `null`.
  - Overlay dan kartu modal dengan daftar aturan.
  - Tombol tutup memanggil `onClose`.
- Cara kerjanya:
  - Ditampilkan oleh `TournamentPage.jsx` ketika pengguna menekan tombol aturan.
- Hubungan:
  - Digunakan oleh `TournamentPage.jsx`.

### `src/pages/RegisterPage.jsx`
- Fungsi utama: halaman pendaftaran akun.
- State / variabel:
  - `name`, `username`, `email`, `password`, `phone`.
  - `errors`, `submitError`, `loading`, `showPassword`.
- Fungsi:
  - `validate()` memeriksa input memakai regex.
  - `handleSubmit()` mengirim POST ke `/auth/register`.
- Komponen dirender:
  - Form dengan `InputField` plus password toggle.
  - Tombol submit.
  - Link ke halaman login.
- Hubungan:
  - Memanggil `api.js` dan `InputField.jsx`.
  - Menyalurkan ke backend register endpoint.

### `src/pages/LoginPage.jsx`
- Fungsi utama: halaman login dan reset kata sandi.
- State / variabel:
  - `username`, `password`, `rememberMe`, `errors`, `submitError`, `loading`, `showPassword`.
  - `showForgotModal`, `forgotEmail`, `maskedEmail`, `emailReadOnly`, `emailHint`, `forgotEmailError`, `resetUrl`.
- Fungsi:
  - `validate()` memastikan username dan password memenuhi aturan.
  - `handleSubmit()` login ke `/auth/login`, menyimpan token/user, dan mengarahkan sesuai `registered`.
  - `handleOpenForgotModal()` membuka modal lupa password dan memanggil `/auth/get-email` jika username tersedia.
  - `handleForgotSubmit()` mengirim `POST /auth/forgot-password`.
- Komponen dirender:
  - Form login, checkbox "Ingat saya", link "Lupa kata sandi?", modal reset.
  - Jika `resetUrl` tersedia, menampilkan tautan reset.
- Hubungan:
  - Menggunakan `InputField.jsx`.
  - Berkomunikasi dengan endpoint `auth/login`, `auth/get-email`, dan `auth/forgot-password`.

### `src/pages/TournamentPage.jsx`
- Fungsi utama: halaman pendaftaran tim.
- State / variabel:
  - `user`, `teamName`, `captainGender`, `memberName`, `memberPhone`, `memberGender`.
  - `errors`, `submitError`, `loading`, `isRulesOpen`.
- Fungsi:
  - `useEffect()` memuat user dari storage dan memeriksa status pendaftaran dengan `GET /tournament/status`.
  - `validate()` memeriksa semua field tim.
  - `handleSubmit()` mengirim `POST /tournament/register`.
  - `handleLogout()` memanggil `POST /auth/logout` dan membersihkan storage.
- Komponen dirender:
  - Form pendaftaran tim dengan bagian Data Tim, Kapten Tim, Anggota Tim.
  - Tombol untuk membuka modal aturan.
  - Tombol logout.
- Hubungan:
  - Menggunakan `RulesModal.jsx`.
  - Memanggil endpoint `tournament/status`, `tournament/register`, dan `auth/logout`.

### `src/pages/ResetPasswordPage.jsx`
- Fungsi utama: halaman reset password dari token.
- State / variabel:
  - `password`, `confirmPassword`, `passwordError`, `confirmError`, `successMessage`, `errorMessage`, `loading`, `showPassword`, `showConfirmPassword`, `token`, `email`.
- Fungsi:
  - `useEffect()` membaca parameter `token` dan `email` dari URL.
  - `validate()` memastikan password 8-16 karakter dan konfirmasi sama.
  - `handleSubmit()` mengirim `POST /auth/reset-password`.
- Komponen dirender:
  - Form input password baru dan konfirmasi.
  - Tombol reset dan link kembali ke login.
- Hubungan:
  - Terhubung ke endpoint `auth/reset-password`.

### `src/pages/FinishPage.jsx`
- Fungsi utama: halaman sukses pendaftaran.
- State / variabel:
  - `user`
- Fungsi:
  - `useEffect()` memuat user dari storage; jika tidak ada, redirect `/login`.
  - `handleLogout()` membersihkan token/user dan redirect.
- Komponen dirender:
  - Pesan "Pendaftaran Berhasil!"
  - Tombol Logout.
- Hubungan:
  - Menyediakan akhir alur pendaftaran tim dan proteksi route melalui `ProtectedRoute.jsx`.

### `src/assets/vite.svg`, `src/assets/react.svg`, `src/assets/hero.png`
- Fungsi utama: aset gambar SVG dan PNG.
- Yang ada:
  - Logo Vite dan React, serta hero image.
- Hubungan:
  - Digunakan di `App.tsx` template default, bukan di halaman pendaftaran aktual.

## 3. Penjelasan File Backend (backend-laravel)

### `app/Providers/AppServiceProvider.php`
- Fungsi utama: service provider standar Laravel.
- Yang ada: metode `register()` dan `boot()` kosong.
- Cara kerjanya: tidak menambahkan logika khusus aplikasi.
- Hubungan: file ini dijalankan oleh Laravel saat bootstrap, tetapi tidak mengubah perilaku.

### `app/Models/User.php`
- Fungsi utama: representasi model pengguna.
- Yang ada:
  - Trait `HasApiTokens`, `HasFactory`, `Notifiable`.
  - `$fillable` untuk `name`, `username`, `email`, `password`, `phone_number`.
  - `$hidden` untuk `password` dan `remember_token`.
  - `casts()` untuk `email_verified_at` dan `password`.
- Cara kerjanya: digunakan oleh controller untuk membuat dan memeriksa data pengguna.
- Hubungan: dipakai di `AuthController`, `Team` relation, dan di `auth.php` config.

### `app/Models/Team.php`
- Fungsi utama: representasi model tim turnamen.
- Yang ada:
  - `$table = 'teams'`.
  - `$fillable` untuk semua atribut tim dan `user_id`.
  - Method `user()` relasi `belongsTo(User::class)`.
- Cara kerjanya: menyimpan dan mengambil data tim yang terkait dengan user.
- Hubungan: dipakai di `TournamentController` dan `AuthController::login` untuk cek pendaftaran.

### `app/Http/Middleware/Authenticate.php`
- Fungsi utama: custom middleware autentikasi.
- Yang ada:
  - `redirectTo()` mengembalikan `null`.
  - `unauthenticated()` memanggil `abort()` dengan respons JSON 401.
- Cara kerjanya: menggantikan redirect halaman default Laravel dengan respons API JSON ketika tidak diautentikasi.
- Hubungan: digunakan oleh middleware auth Laravel saat route `auth:sanctum` dipanggil.

### `app/Http/Controllers/Api/AuthController.php`
- Fungsi utama: mengelola autentikasi, pendaftaran, logout, reset password.
- Method/fungsi yang ada:
  - `register(Request $request)`:
    - validasi `name`, `username`, `email`, `password`, `phone_number`.
    - `username` unique di tabel users.
    - `email` unique di tabel users.
    - `phone_number` numeric dan `digits_between:11,13`.
    - menyimpan user dan password hashed.
    - mengembalikan JSON 201.
  - `login(Request $request)`:
    - validasi `username`, `password`.
    - mencari user dan memeriksa password dengan `Hash::check`.
    - membuat token Sanctum dengan `createToken('auth_token')`.
    - memeriksa apakah user sudah punya `Team`.
    - mengembalikan `token`, `registered`, dan data user.
  - `logout(Request $request)`:
    - menghapus `currentAccessToken()`.
    - mengembalikan pesan sukses.
  - `forgotPassword(Request $request)`:
    - validasi email.
    - mencari user berdasarkan email.
    - buat token acak 64 karakter.
    - simpan hash token di tabel `password_reset_tokens`.
    - kembalikan `reset_url` yang mengarahkan ke frontend `/reset-password`.
  - `resetPassword(Request $request)`:
    - validasi `token`, `email`, `password`.
    - mengambil record token dari tabel.
    - mencocokkan hash token dengan `hash_equals`.
    - memperbarui password user dengan hash baru.
    - menghapus token reset.
    - mengembalikan pesan sukses.
  - `getEmailByUsername(Request $request)`:
    - validasi `username`.
    - mencari user.
    - mengembalikan email asli dan `masked_email`.
- Validasi yang diterapkan:
  - aturan validasi ketat pada username, password, email, nomor telepon.
  - token reset dipastikan valid dan matching hash.
- Respons yang dikembalikan:
  - JSON berisi pesan, data user, token, status terdaftar, atau `reset_url`.
- Hubungan:
  - Berinteraksi dengan model `User`, tabel `password_reset_tokens`, dan model `Team`.

### `app/Http/Controllers/Api/TournamentController.php`
- Fungsi utama: mengelola status dan pendaftaran tim.
- Method/fungsi yang ada:
  - `status(Request $request)`:
    - mengambil `Team` berdasarkan `user_id` dari user yang diautentikasi.
    - mengembalikan `registered` boolean dan data tim.
  - `register(Request $request)`:
    - validasi `team_name`, `captain_name`, `captain_phone`, `captain_gender`, `member_name`, `member_phone`, `member_gender`.
    - `team_name` unique di tabel teams.
    - `captain_gender` dan `member_gender` hanya `Pria` atau `Wanita`.
    - memeriksa apakah user sudah terdaftar sebagai tim.
    - menyimpan tim baru dengan `user_id`.
    - mengembalikan `registered: true` dan `team`.
  - `candidates(Request $request)`:
    - mengambil semua `Team`.
    - mengembalikan daftar tim.
- Validasi yang diterapkan:
  - aturan server-side untuk nama tim, nama, nomor telepon, dan gender.
- Respons yang dikembalikan:
  - JSON status pendaftaran dan detail tim.
- Hubungan:
  - Berinteraksi dengan model `Team` dan middleware `auth:sanctum`.

### `routes/api.php`
- Fungsi utama: mendefinisikan endpoint API.
- Yang ada:
  - Route publik: `auth/register`, `auth/login`, `auth/forgot-password`, `auth/get-email`, `auth/reset-password`.
  - Route terproteksi `auth:sanctum`: `auth/logout`, `tournament/status`, `tournament/register`, `tournament/candidates`.
- Cara kerjanya:
  - Mengatur akses endpoint dan proteksi token.
- Hubungan:
  - Menggunakan controller `AuthController` dan `TournamentController`.

### `routes/web.php`
- Fungsi utama: route web standar Laravel.
- Yang ada: route `'/'` mengembalikan view `welcome`.
- Hubungan: tidak berhubungan langsung dengan API frontend.

### `routes/console.php`
- Fungsi utama: mendefinisikan command artisan konsol.
- Yang ada: command `inspire` standar Laravel.
- Hubungan: bukan bagian alur aplikasi web.

### `config/app.php`
- Fungsi utama: konfigurasi aplikasi Laravel umum.
- Pengaturan penting: `name`, `env`, `debug`, `url`, `timezone`, `locale`, `key`, `cipher`.
- Cara kerjanya: menyimpan environment default.
- Hubungan: mempengaruhi konfigurasi umum dan URL frontend/backend.

### `config/auth.php`
- Fungsi utama: konfigurasi autentikasi.
- Yang ada:
  - guard default `web`.
  - provider `users` dengan model `User::class`.
  - password reset table `password_reset_tokens`.
- Hubungan: mempengaruhi login dan reset password Laravel.

### `config/cache.php`
- Fungsi utama: konfigurasi cache.
- Yang ada: store default `database`, pengaturan cache dan lock.
- Hubungan: relevant untuk cache Laravel, bukan langsung ke flow utama.

### `config/cors.php`
- Fungsi utama: aturan CORS.
- Yang ada: mengizinkan semua origin, method, header untuk `api/*`.
- Hubungan: memungkinkan frontend dari domain lain memanggil API.

### `config/database.php`
- Fungsi utama: konfigurasi koneksi database.
- Yang ada:
  - `default` driver `sqlite`.
  - koneksi untuk `sqlite`, `mysql`, `pgsql`, `sqlsrv`.
- Hubungan: menentukan penggunaan database lokal atau cloud.

### `config/filesystems.php`
- Fungsi utama: konfigurasi filesystem.
- Yang ada: disk `local`, `public`, `s3`.
- Hubungan: tidak langsung terkait alur pendaftaran tim.

### `config/logging.php`
- Fungsi utama: konfigurasi logging Laravel.
- Yang ada: channel `stack`, `single`, `daily`, `slack`, dll.
- Hubungan: standar Laravel untuk pencatatan.

### `config/mail.php`
- Fungsi utama: konfigurasi mailer.
- Yang ada: mailer `log` default, `smtp`, `ses`, `postmark`, `resend`.
- Hubungan: belum digunakan secara eksplisit dalam kode, tetapi siap untuk pengiriman email.

### `config/queue.php`
- Fungsi utama: konfigurasi antrean pekerjaan.
- Yang ada: default `database`, koneksi `sync`, `database`, `redis`, dll.
- Hubungan: bukan bagian flow utama saat ini.

### `config/sanctum.php`
- Fungsi utama: konfigurasi Laravel Sanctum.
- Yang ada:
  - `stateful` domains default `localhost` dan host lain.
  - guard `web`.
  - `expiration` null.
- Hubungan: mengatur autentikasi token API dan domain stateful.

### `config/session.php`
- Fungsi utama: konfigurasi session.
- Yang ada: driver `database`, lifetime, cookie, `http_only`, `same_site`.
- Hubungan: Laravel session defaults, meski frontend menggunakan token dan storage browser.

### `config/services.php`
- Fungsi utama: konfigurasi layanan pihak ketiga.
- Yang ada: postmark, resend, ses, slack.
- Hubungan: file konfigurasi standar Laravel tanpa logika aplikasi khusus.

### `database/migrations/0001_01_01_000000_create_users_table.php`
- Fungsi utama: membuat tabel `users`, `password_reset_tokens`, `sessions`.
- Yang ada: kolom `id`, `name`, `email`, `password`, `remember_token`, timestamp.
- Hubungan: basis untuk user authentication dan password reset.

### `database/migrations/0001_01_01_000001_create_cache_table.php`
- Fungsi utama: membuat tabel cache dan cache_locks.
- Yang ada: struktur cache Laravel.
- Hubungan: digunakan jika aplikasi memakai cache database.

### `database/migrations/0001_01_01_000002_create_jobs_table.php`
- Fungsi utama: membuat tabel queue jobs, job_batches, failed_jobs.
- Yang ada: tabel antrean Laravel.
- Hubungan: bukan flow pendaftaran langsung, tetapi mendukung pekerjaan background.

### `database/migrations/2026_05_18_175527_create_personal_access_tokens_table.php`
- Fungsi utama: membuat tabel `personal_access_tokens` untuk Sanctum.
- Yang ada: kolom `tokenable`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`.
- Hubungan: menyimpan token Bearer yang dibuat saat login.

### `database/migrations/2026_05_18_190924_add_username_and_phone_to_users_table.php`
- Fungsi utama: menambahkan kolom `username` dan `phone_number` ke tabel `users`.
- Yang ada: kolom `username` unik, `phone_number` string.
- Hubungan: memungkinkan login dengan username dan menyimpan nomor telepon kapten.

### `database/migrations/2026_05_18_192020_create_teams_table.php`
- Fungsi utama: membuat tabel `teams`.
- Yang ada: `user_id` foreign key, `team_name` unique, `captain_name`, `captain_phone`, `captain_gender`, `member_name`, `member_phone`, `member_gender`, timestamps.
- Hubungan: menyimpan pendaftaran tim turnamen.

### `database/factories/UserFactory.php`
- Fungsi utama: factory model user untuk seed/testing.
- Yang ada: definisi faker nama, email, password, remember token.
- Hubungan: digunakan oleh `DatabaseSeeder.php` jika diperlukan.

### `database/seeders/DatabaseSeeder.php`
- Fungsi utama: seed awal database.
- Yang ada: membuat satu user `Test User` dengan email `test@example.com`.
- Hubungan: membantu pengujian awal jika migrasi dijalankan.

## 4. Penjelasan Alur Data

### Frontend → Backend → Database
- `RegisterPage.jsx` mengirim `name`, `username`, `email`, `password`, `phone_number` ke `POST /api/auth/register`.
- Backend menyimpan data di tabel `users`.
- `LoginPage.jsx` mengirim `username`, `password` ke `POST /api/auth/login`.
- Backend mengambil user dari tabel `users`, memverifikasi password hash, membuat token di tabel `personal_access_tokens`, lalu mengembalikan token dan informasi user.
- `TournamentPage.jsx` mengirim `team_name`, `captain_name`, `captain_phone`, `captain_gender`, `member_name`, `member_phone`, `member_gender` ke `POST /api/tournament/register`.
- Backend menyimpan data tim ke tabel `teams` dengan `user_id` yang diautentikasi.
- `LoginPage.jsx` / modal lupa password mengirim email ke `POST /api/auth/forgot-password`.
- Backend menyimpan token reset hashed di tabel `password_reset_tokens`.
- `ResetPasswordPage.jsx` mengirim `token`, `email`, `password` ke `POST /api/auth/reset-password`.
- Backend memverifikasi token, memperbarui password di tabel `users`, lalu menghapus record `password_reset_tokens`.

### Database → Backend → Frontend
- Backend membaca tabel `users` untuk login dan `getEmailByUsername`.
- Backend membaca tabel `teams` untuk `tournament/status` dan menentukan redirect `registered`.
- Backend membaca tabel `personal_access_tokens` untuk autentikasi token Sanctum.
- Backend membaca tabel `password_reset_tokens` untuk verifikasi reset password.
- Frontend menerima jawaban JSON dan mengarahkan halaman atau menampilkan pesan sesuai respons.

## 5. Penjelasan Keamanan

### Autentikasi dengan Bearer Token
- `services/api.js` menambahkan header `Authorization: Bearer <token>` dari `localStorage` atau `sessionStorage`.
- Endpoint API sensitif (`auth/logout`, `tournament/status`, `tournament/register`, `tournament/candidates`) berada di middleware `auth:sanctum`.
- Backend menggunakan Laravel Sanctum untuk memvalidasi token.
- Jika token tidak valid, backend membalas 401 dan frontend menghapus token serta mengarahkan ke login.

### Validasi sisi klien
- `RegisterPage.jsx` memeriksa format nama pengguna, email, password, dan nomor telepon.
- `LoginPage.jsx` memeriksa panjang dan karakter username serta panjang password.
- `TournamentPage.jsx` memeriksa format nama tim, nama anggota, nomor telepon, dan pemilihan gender.
- `ResetPasswordPage.jsx` memeriksa panjang password dan kecocokan konfirmasi.
- Validasi klien membantu mencegah data invalid dikirim ke server.

### Validasi sisi server
- Setiap endpoint penting memakai `$request->validate(...)` di controller.
- `AuthController::register()` menegakkan unique username/email dan panjang password serta digit telepon.
- `AuthController::login()` memeriksa username/password melalui hash.
- `AuthController::forgotPassword()` memastikan email valid dan user ada.
- `AuthController::resetPassword()` memverifikasi token reset menggunakan hash secure.
- `TournamentController::register()` memvalidasi format `team_name`, nama, telepon, dan gender, serta memastikan satu user hanya mendaftar sekali.

### Proteksi halaman
- `ProtectedRoute.jsx` memblokir akses ke `/tournament` dan `/finish` jika token tidak ditemukan.
- `TournamentPage.jsx` juga memeriksa token/user dari storage dan memaksa redirect jika hilang.
- `FinishPage.jsx` melakukan hal yang sama untuk memastikan hanya user terautentikasi.
- Backend `Authenticate` middleware mengembalikan JSON 401 bukan redirect biasa.
- `api.js` menangani 401 secara global dengan membersihkan storage dan redirect ke `/login`.
