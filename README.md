<<<<<<< HEAD
<<<<<<< HEAD
# pweb-cinesolve
=======
# Welcome to your Lovable project
=======
### Ni'mah Fauziyyah, NRP 5027241103, Kelas C
>>>>>>> c89b4b4 (draft1)

# 🎬 CineSolve — Final Project Concept

CineSolve adalah aplikasi rekomendasi film dan drama yang ditujukan untuk mahasiswa, khususnya yang sering bingung dalam mencari tontonan relevan. Aplikasi ini dilengkapi dengan fitur review, bookmark, dan rekomendasi personal untuk memudahkan pengguna dalam memilih tontonan sesuai dengan preferensi mereka.

---

## 🧩 1. Problem Statement

Mahasiswa, terutama perantau, sering menghadapi masalah berikut:

- Bingung memilih film atau drama karena terlalu banyak pilihan
- Sulit menemukan rekomendasi yang sesuai dengan mood, negara, atau genre
- Lupa film yang ingin ditonton
- Tidak punya tempat untuk menyimpan film favorit
- Review film tidak terpusat

CineSolve hadir untuk menyederhanakan proses memilih tontonan dan memberikan tempat untuk menyimpan daftar film favorit secara digital.

---

## 🚀 2. Solution Overview

CineSolve menyediakan platform dengan fitur-fitur berikut:

- **List film rekomendasi** berdasarkan genre & negara
- **Detail film lengkap** dengan informasi lengkap tentang film
- **Review dari user lain** dan rating film
- **Bookmark list** untuk menyimpan film favorit
- **Upload poster (admin)** untuk menambahkan poster film
- **Tambah film lewat URL poster (opsional)**
- **Dark mode** untuk kenyamanan mata mahasiswa

---

## 🧱 3. Tech Stack

**Frontend**:

- React.js
- React Router
- Axios
- TailwindCSS
- Context/Redux (opsional)
- LocalStorage (akses token + mode gelap)

**Backend**:

- Node.js + Express
- MongoDB Local
- Mongoose
- Multer (untuk upload file)
- JWT Authentication
- Bcrypt (untuk hashing password)

---

## 🗂️ 4. Frontend — Final Pages

1. **Login & Register Page**

   - JWT Authentication
   - Simpan token ke LocalStorage
   - Redirect sesuai role pengguna (User / Admin)

2. **Dashboard**

   - **User Dashboard**:
     - Rekomendasi film berdasarkan genre & negara
     - Search film
     - Filter berdasarkan negara
     - Dark mode toggle
   - **Admin Dashboard**:
     - Daftar film yang tersedia
     - Tombol tambah/edit/hapus film

3. **Film Detail Page**

   - Poster film (upload atau URL)
   - Genre, negara, tahun
   - Deskripsi film
   - Rating rata-rata
   - Daftar review pengguna
   - Form untuk menambah review

4. **Bookmark Page (User)**

   - Daftar film yang telah disimpan
   - Quick remove bookmark
   - Klik untuk menuju halaman detail film

<<<<<<< HEAD
Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
>>>>>>> 5915865 (Initial commit from template vite_react_shadcn_ts_20250728_minor)
=======
5. **Admin: Add/Edit Film**
   - Form untuk menambah/edit film yang berisi:
     - Title
     - Genre
     - Country
     - Year
     - Description
     - Upload poster (file)
     - Poster via URL (opsional)
     - Preview poster muncul otomatis

---

## 🛠️ Setup Instructions

### 1. Setup Frontend

1. Masuk ke direktori frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```

### 2. Setup Backend

1. Masuk ke direktori backend:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan aplikasi backend:
   ```bash
   npm run dev
   ```

---
>>>>>>> c89b4b4 (draft1)
