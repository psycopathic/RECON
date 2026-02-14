# RE-CON — E‑Commerce (Frontend + Backend)

This repository contains a small e‑commerce example app with a React + Vite frontend and a Node/Express backend.

## Features (what's implemented)

- Authentication
  - Signup / login flows using JWT access and refresh tokens
  - `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` used for signing tokens
  - Refresh token storage and cookie utilities

- Users
  - User model with roles (regular user / admin)
  - Protected admin routes (example: dashboard)

- Products & Categories
  - Product model with `name`, `description`, `price`, `image`, `category`, `isFeatured`
  - Routes to create, list, and fetch products by category
  - Category-driven product listing (frontend category pages)

- Cart & Orders
  - Cart endpoints and client-side cart store
  - Order model and basic order creation flow

- Payments (Stripe)
  - Server-side Stripe integration for checkout sessions
  - `CLIENT_URL` used for success/cancel redirects

- Coupons
  - Coupon model and coupon validation endpoints

- File uploads (Cloudinary)
  - Image upload integration via Cloudinary

- Caching / Session store
  - Redis integration (via Upstash or other Redis URL) for tokens/caching

- Analytics
  - Basic analytics endpoints and a simple chart on the admin UI (frontend)

- Admin UI (frontend)
  - Pages for product management and analytics (example components present)

## Repo layout

- `/backend` — Express server, models, controllers, routes, `index.js` entry
- `/frontend` — React app (Vite), components, pages, Tailwind styles

## Getting started — Backend

1. Copy environment variables:

   ```bash
   cd backend
   cp .env.example .env
   # then edit backend/.env and fill real values
   ```

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

3. Seed sample categories/products (optional):

   ```bash
   npm run seed
   ```

Notes:
- Ensure `MONGODB_URI` is valid and reachable (if using Atlas, add your IP to Network Access).
- If `UPSTASH_REDIS_URL` is placeholder, the Redis client may throw DNS errors.

## Getting started — Frontend

1. Install and run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Images served from Vite:
- Place static images in `frontend/public/` (then use `/image.jpg`), or import them from `src/assets`.

## Scripts

- Backend: `npm run dev` — starts server with `nodemon`
- Backend: `npm run seed` — seed categories/products
- Frontend: `npm run dev` — start Vite dev server

## Environment variables

See `backend/.env.example`. Key variables include:
- `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `CLOUDINARY_*`, `UPSTASH_REDIS_URL`.

## Troubleshooting

- Blank white frontend:
  - Check browser DevTools Console for errors. Common causes:
    - Missing `import React from 'react'` in JSX components when using the classic JSX runtime.
    - Images not found — ensure images are in `public/` or imported correctly.

- Redis `getaddrinfo EAI_AGAIN`:
  - `UPSTASH_REDIS_URL` is not set or unreachable. Update `.env` with a valid URL.

- MongoDB connection issues:
  - Ensure `MONGODB_URI` is correct and the IP address is allowed in Atlas.

## Next steps you might want

- Add more realistic seed data (product images, descriptions)
- Harden error handling for external services (Redis, Cloudinary, Stripe)
- Add tests and CI configuration

---

If you want, I can update the frontend to import images from `src/assets` for the homepage, or copy placeholder images into `frontend/public/` and wire them up for you.
