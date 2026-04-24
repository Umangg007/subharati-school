# Subharati Backend

Node/Express backend with MongoDB, JWT auth, forms APIs, gallery APIs, uploads, and optional email notifications.

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Start dev server:
   - `npm run dev`

## API Overview
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Enquiries
  - `POST /api/enquiries`
  - `GET /api/enquiries` (auth required)
- Admissions
  - `POST /api/admissions`
  - `GET /api/admissions` (auth required)
- Gallery
  - `GET /api/gallery`
  - `POST /api/gallery` (auth required)
- Uploads
  - `POST /api/uploads` (auth required)

Uploads are served from `/uploads`.

## Roles
- Users whose email appears in `ADMIN_EMAILS` get the `admin` role on registration.
- Admin role is required for listing enquiries/admissions, creating gallery items, and uploading files.
