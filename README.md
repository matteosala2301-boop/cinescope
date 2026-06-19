# 🎬 CineScope — Frontend Programming Final Project

A React application for browsing, reviewing and managing movies, built as the
final project for the **EPICODE – Frontend Programming** course.

It demonstrates modern React: component composition, state management with
**Redux Toolkit + Thunk**, routing with **React Router** (including dynamic
routes), asynchronous API calls and a fake authentication system with roles.

---

## 📋 Project Overview

CineScope is a movie database where:

- **Anyone** can browse the catalogue, filter/search/sort movies and read reviews.
- **Logged-in users** can write and delete their own reviews.
- **Admins** get a management dashboard to **create, edit and delete** movies.

Data is served by a local **Json Server** REST API (`db.json`) with real CRUD
operations and server-side pagination.

---

## ✨ Features

- **Home page** with a hero banner and the top-rated movies.
- **Movies listing** with:
  - text search (debounced),
  - genre filter,
  - sorting (rating / year / title),
  - **server-side pagination**.
- **Movie detail page** via a **dynamic route** (`/movies/:id`) showing full info
  and a reviews section.
- **Authentication** (fake auth) with two **roles**:
  - `user` — browse + write/delete own reviews,
  - `admin` — everything + management dashboard.
- **Admin dashboard** with a table to manage the catalogue.
- **5 controlled forms with validation** (the brief requires at least 4):
  1. Login
  2. Register
  3. Create / Edit movie (admin)
  4. Write review (user)
  5. Edit profile (logged-in user)
- **Protected routes** and **role-based** rendering.
- Loading and error states throughout (conditional rendering).
- Responsive UI built with **React-Bootstrap**.

---

## 🛠️ Technologies Used

| Area | Technology |
|------|------------|
| UI library | React 19 |
| Build tool | Vite |
| Global state | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| Async actions | Redux Thunk (`createAsyncThunk`) |
| Routing | React Router (`react-router-dom`) |
| Styling | Bootstrap 5 + React-Bootstrap |
| Mock API | json-server |
| Dev tooling | concurrently |

---

## 🚀 Running Instructions

### Prerequisites
- Node.js 18+ and npm

### 1. Install dependencies
```bash
npm install
```

### 2. Start the app + API together
```bash
npm start
```
This runs **both** the Json Server (port **3001**) and the Vite dev server
(port **5173**) at the same time.

Then open: **http://localhost:5173**

### Run them separately (optional)
```bash
npm run server   # Json Server on http://localhost:3001
npm run dev      # Vite dev server on http://localhost:5173
```

### Build for production
```bash
npm run build
```

---

## 🔑 Demo Accounts

| Role  | Email             | Password   |
|-------|-------------------|------------|
| Admin | admin@movies.com  | `admin123` |
| User  | user@movies.com   | `user123`  |

You can also register a new account (created with the `user` role).

---

## 📁 Project Structure

```
cinescope/
├── db.json                  # Json Server database (movies, users, reviews)
├── src/
│   ├── api/
│   │   └── api.js           # fetch wrapper for the REST API
│   ├── store/               # Redux store + slices (Thunks)
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── moviesSlice.js
│   │   └── reviewsSlice.js
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx  NavBar.jsx  Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── MovieCard.jsx  MovieList.jsx  MovieForm.jsx
│   │   ├── SearchFilters.jsx  PaginationBar.jsx
│   │   ├── RatingStars.jsx  ReviewForm.jsx  ReviewList.jsx
│   │   └── Loader.jsx  ErrorMessage.jsx
│   ├── pages/               # Route pages
│   │   ├── Home.jsx  Movies.jsx  MovieDetail.jsx
│   │   ├── Login.jsx  Register.jsx  Profile.jsx
│   │   ├── Dashboard.jsx  CreateMovie.jsx  EditMovie.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx              # Routes
│   └── main.jsx             # Providers (Redux + Router)
└── README.md
```

---

## 🧭 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | public |
| `/movies` | Movies listing (filters + pagination) | public |
| `/movies/:id` | Movie detail (dynamic route) | public |
| `/login` | Login | public |
| `/register` | Register | public |
| `/profile` | Profile | logged-in |
| `/dashboard` | Admin dashboard | admin |
| `/dashboard/movies/new` | Create movie | admin |
| `/dashboard/movies/:id/edit` | Edit movie | admin |
| `*` | 404 Not Found | public |

---

_EPICODE Institute of Technology — Frontend Programming Final Exam._
