### Ni'mah Fauziyyah, NRP 5027241103, Kelas C

# 🎬 CineSolve 

CineSolve adalah aplikasi rekomendasi film dan drama yang ditujukan untuk mahasiswa, khususnya yang sering bingung dalam mencari tontonan relevan. Aplikasi ini dilengkapi dengan fitur mood-based discovery, watch sources, review, bookmark, dan rekomendasi personal untuk memudahkan pengguna dalam memilih tontonan sesuai dengan preferensi dan suasana hati mereka.

---

## 🧩 1. Problem Statement

Mahasiswa, terutama perantau, sering menghadapi masalah berikut:

- Bingung memilih film atau drama karena terlalu banyak pilihan
- Sulit menemukan rekomendasi yang sesuai dengan mood/emosi, negara, atau genre
- Lupa film yang ingin ditonton
- Tidak punya tempat untuk menyimpan film favorit
- Review film tidak terpusat
- Kesulitan menemukan platform streaming mana saja yang menyediakan film tersebut

CineSolve hadir untuk menyederhanakan proses memilih tontonan, memberikan rekomendasi berdasarkan mood, menyimpan daftar film favorit secara digital, dan menampilkan platform streaming yang tersedia.

---

## 🚀 2. Solution Overview

CineSolve menyediakan platform dengan fitur-fitur berikut:

### **User Features:**

- **Mood-Based Discovery** - Rekomendasi film berdasarkan emosi/suasana hati (Fun & Light, Excited & Energetic, Dark & Intense, Emotional & Thoughtful)
- **Trending Section** - Carousel film trending dengan ranking number
- **Browse All Movies** - Grid responsif dengan filter genre & negara
- **Advanced Search** - Pencarian berdasarkan judul, deskripsi, genre, negara
- **Film Detail** - Informasi lengkap: genre, tahun, negara, deskripsi, rating
- **Watch Sources** - Platform streaming mana saja yang memiliki film (Netflix, Disney+, Prime Video, Viu, iQiyi, Vidio, WeTV)
- **Review System** - Rating & review dari user lain dengan star rating
- **User Review** - User dapat menambah/menghapus review pribadi
- **Bookmark/Wishlist** - Menyimpan film favorit untuk ditonton nanti
- **Dark Mode** - Toggle dark/light mode dengan persistent storage
- **Responsive Design** - Mobile-friendly UI (tested pada berbagai ukuran screen)

### **Admin Features:**

- **Movie Management** - CRUD (Create, Read, Update, Delete) film
- **Dual Poster Source** - Upload file atau gunakan URL eksternal
- **Watch Sources Management** - Tambahkan platform streaming dengan URL yang auto-fill
- **Mood Tags** - Tambahkan custom mood tags untuk setiap film (contoh: 'Epic', 'Futuristic', 'Heartfelt')
- **Genre & Country Management** - Admin dashboard untuk mengelola genre dan negara

---

## 🧱 3. Tech Stack

**Frontend:**

- React 18+ dengan TypeScript
- React Router v6 (SPA routing & protected routes)
- Axios (HTTP client dengan custom interceptors)
- TailwindCSS + PostCSS (styling responsif)
- shadcn/ui (pre-built accessible components)
- Lucide React (icon library)
- React Query (caching & state management)
- localStorage (token persistence & dark mode storage)

**Backend:**

- Node.js + Express.js
- MongoDB Local (NoSQL database)
- Mongoose (ODM untuk MongoDB)
- Multer (file upload handling)
- JWT (Bearer token authentication)
- Bcrypt (password hashing)
- CORS middleware
- Custom middleware (auth, admin verification, upload)

**API Endpoints:**

- `/api/auth/login` - Login user
- `/api/auth/register` - Register user baru
- `/api/movies` - GET all movies, POST new movie
- `/api/movies/:id` - GET/PUT/DELETE film
- `/api/movies/trending` - GET trending films
- `/api/movies/:id/bookmark` - POST/DELETE bookmark
- `/api/reviews` - POST review
- `/api/reviews/movie/:id` - GET reviews untuk film
- `/api/reviews/:id` - DELETE review
- `/api/genres` - GET all genres
- `/api/countries` - GET all countries
- `/uploads/posters/*` - Static file serving

**Database Schema:**

```javascript
// Film Model
{
  title: String (required),
  description: String,
  posterType: String ('upload' | 'url'),
  posterUpload: String (file path),
  posterUrl: String (external URL),
  genre: [String],
  country: String,
  moodTags: [String], 
  releaseYear: Number,
  watchSources: [{
    platformName: String,
    platformIcon: String,
    platformUrl: String
  }],
  created_by: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}

// Watch Platforms (7 platform)
- Netflix → https://www.netflix.com/browse
- Disney+ → https://disneyplus.com/
- Prime Video → https://www.primevideo.com/
- Viu → https://www.viu.com/
- iQiyi → https://www.iq.com/
- Vidio → https://www.vidio.com/
- WeTV → https://wetv.vip/id
```

---

## 🗂️ 4. Frontend — Pages & Features

### **Authentication Pages:**

1. **Login Page**

   - Email & password authentication
   - JWT token storage di localStorage
   - Role-based redirect (User → /home, Admin → /admin)
   - Dark mode toggle
   - Responsive design

2. **Register Page**
   - Form validasi nama, email, password
   - Password strength indicator
   - Link ke login page
   - Dark mode toggle

### **User Pages:**

3. **Landing Page (Public)**

   - Feature showcase
   - Call-to-action buttons (Sign In / Sign Up)
   - Info tentang aplikasi
   - Dark mode toggle

4. **User Home (Dashboard)**

   - **Welcome section** dengan nama user
   - **Mood Selection** - 4 pilihan mood (Fun & Light, Excited & Energetic, Dark & Intense, Emotional & Thoughtful)
   - **Search & Filters**:
     - Search by title/description
     - Filter by country
     - Filter by genre
     - Mood filter (auto-clears manual genre filter)
   - **Trending Section** - Carousel film trending dengan ranking badge
   - **Browse All Movies** - Grid responsif (2 kolom mobile, 3 tablet, 4 desktop)
   - **Dark mode toggle**
   - **Navigation** - Bookmark, Profile, Logout buttons
   - Fully responsive (mobile, tablet, desktop)

5. **Movie Detail Page**

   - Poster card (48×72) layout responsif
   - Film metadata: judul, tahun, negara, genre
   - Deskripsi film
   - **Watch Sources** - Platform streaming dengan icon & clickable link
   - **Review Section**:
     - Star rating selector (1-5)
     - Textarea untuk review
     - Submit button
     - Daftar review dari user lain dengan rating & username
     - Delete review button (hanya untuk owner review)
   - Back button ke home
   - Fully responsive

6. **Bookmarks Page**

   - Daftar semua film yang di-bookmark
   - Grid responsif (2 kolom mobile, 3 tablet, 4 desktop)
   - 3-dot menu untuk remove bookmark
   - Counter "X movies bookmarked"
   - Empty state message
   - Back button

7. **Profile Page**
   - Avatar circle dengan user icon
   - Display nama user
   - Display email user
   - Minimal & clean design

### **Admin Pages:**

8. **Admin Dashboard**

   - Welcome message
   - Quick access cards:
     - "View Movies" - Link ke AdminMovies
     - "Add New Movie" - Link ke AddMovie
   - Sidebar navigation

9. **Admin Movies (List)**

   - Responsive table dengan columns:
     - Title (always visible)
     - Year (hidden di mobile)
     - Country (hidden di tablet)
     - Genre (hidden di mobile & tablet)
     - Actions (Edit/Delete buttons)
   - Add Movie button di header
   - Delete confirmation dialog
   - Mobile-friendly (horizontal scroll jika perlu)

10. **Add Movie (Form)**

    - Input fields:
      - Title
      - Description (textarea)
      - **Poster Source** - Radio button (Upload / URL)
      - Genre multi-select
      - Country select
      - Release Year
      - **Watch Sources** - Platform selector dengan auto-fill URL
    - File upload dengan preview
    - Responsive layout
    - Submit & back buttons

11. **Edit Movie (Form)**

    - Same sebagai Add Movie
    - Load existing data dari database
    - Update logic

12. **Admin Profile** (jika ada)
    - Sama seperti User Profile

---

## ✨ 5. Key Features Breakdown

### **Mood-Based Discovery**

- User dapat filter berdasarkan 4 mood preset
- Setiap mood memiliki genre recommendation default

### **Watch Sources / Streaming Platforms**

- 7 platform terintegrasi dengan icon & URL
- Admin dapat set platform untuk setiap film
- URL auto-fill berdasarkan platform selection
- Icon display di movie detail page
- Clickable link ke platform streaming

### **Dark Mode Persistence**

- Toggle dark mode tersedia di semua pages
- Preference disimpan di localStorage
- Apply secara global (semua pages tetap dark/light)
- System preference fallback untuk first visit

### **Responsive Design**

- Mobile: Optimized untuk HP (375px+)
- Tablet: Optimized untuk tablet (768px+)
- Desktop: Full experience (1024px+)
- Adaptive typography, spacing, dan layout
- Touch-friendly buttons & clickables

### **File Upload**

- Support image upload (JPG, PNG, WebP)
- Max size: 10MB
- Preview sebelum upload
- CORS enabled untuk serve uploaded files
- Static serving di `/uploads/posters/*`

---

## 📦 6. Project Structure

```
cinesolve/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DarkModeToggle.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── ui/ (shadcn components)
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UserHome.tsx
│   │   │   ├── MovieDetail.tsx
│   │   │   ├── Bookmarks.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminMovies.tsx
│   │   │       ├── AddMovie.tsx
│   │   │       └── EditMovie.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.tsx
│   │   ├── lib/
│   │   │   ├── axios.ts (Axios interceptor)
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── App.css
│   ├── public/ (static files & platform icons)
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Film.js
│   │   │   ├── Review.js
│   │   │   ├── Genre.js
│   │   │   └── Country.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── filmController.js
│   │   │   ├── reviewController.js
│   │   │   ├── genreController.js
│   │   │   └── countryController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── filmRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── genreRoutes.js
│   │   │   └── countryRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/
│   │   └── posters/ (uploaded film posters)
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🛠️ 7. Setup Instructions (UPDATED)

### **Prerequisites:**

- Node.js (v16+)
- MongoDB Local (port 27017)
- npm/pnpm

### **Backend Setup:**

```bash
cd backend
npm install
npm run dev  # http://localhost:3000
```

### **Frontend Setup:**

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```
