# CineSolve Backend - Express.js + MongoDB

## Prerequisites

- Node.js (v14+)
- MongoDB running locally (port 27017)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and ensure:

- MONGO_URI=mongodb://127.0.0.1:27017/cinesolve
- JWT_SECRET=your_jwt_secret_here
- PORT=5000
- FRONTEND_ORIGIN=http://localhost:5173

### 3. Start MongoDB (if not running)

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod --dbpath /usr/local/var/mongodb
```

### 4. Seed Database (Optional)

Create admin user and sample films:

```bash
npm run seed
```

**Default Credentials After Seed:**

- Admin: admin@cinesolve.com / admin123
- User: john@example.com / user123

### 5. Run Server

```bash
npm run dev
```

Server will run on: http://localhost:5000

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Movies

- GET /api/movies
- GET /api/movies/:id
- GET /api/movies/trending
- POST /api/movies (admin only)
- PUT /api/movies/:id (admin only)
- DELETE /api/movies/:id (admin only)
- POST /api/movies/:id/bookmark
- DELETE /api/movies/:id/bookmark
- GET /api/movies/bookmarks/list

### Reviews

- GET /api/reviews/movie/:movieId
- POST /api/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

## Connect Frontend

Frontend axios baseURL is configured to http://localhost:5000/api
