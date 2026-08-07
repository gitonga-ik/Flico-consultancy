# Flico Consultancy

Flico Consultancy is a modern web application and e-commerce platform built for a professional counselling and training organization. The platform enables individuals, families, and corporate organizations to access addiction counselling, chronic stress management resources, youth mentorship programs, and purchase/read educational books digitally.

---

## Features

- **Services Showcase:** Dedicated pages for Addiction Counselling, Corporate Stress Training, Youth Mentorship, and Workplace Productivity workshops.
- **Digital Book Store & Reader:** E-commerce capabilities to browse, purchase, and preview published works with integrated PDF rendering.
- **M-Pesa Payment Gateway Integration:** Automated mobile payment processing powered by Safaricom's Daraja API.
- **Email Notifications:** Automated order confirmations and digital delivery links via Resend and React Email.
- **Cloud Media & Storage:** Media management and dynamic asset rendering with Cloudinary and Supabase Storage.
- **Type-safe Database Layer:** Schema modeling and type-safe database queries with Prisma ORM and PostgreSQL.

---

## Tech Stack & Dependencies

### Core Framework & UI

- **[Next.js 16](https://nextjs.org/)** (App Router & Server Actions)
- **[React 19](https://react.dev/)** & **[React DOM 19](https://react.dev/)**
- **[TypeScript 5](https://www.typescriptlang.org/)**

### Styling & Design

- **[Tailwind CSS v4](https://tailwindcss.com/)** (`@tailwindcss/postcss`)
- **[DaisyUI v5](https://daisyui.com/)**
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** & **[Lucide React](https://lucide.dev/)**

### Database & ORM

- **[PostgreSQL](https://www.postgresql.org/)**
- **[Prisma ORM 7](https://www.prisma.io/)** (`@prisma/client`, `@prisma/adapter-pg`, `prisma`)

### Media, File & PDF Processing

- **[MuPDF](https://mupdf.com/)** (Server-side PDF processing and preview generation)
- **[Sharp](https://sharp.pixelplumbing.com/)** (High-performance image processing)
- **[Browser Image Compression](https://www.npmjs.com/package/browser-image-compression)** (Client-side image optimization)
- **[Cloudinary](https://cloudinary.com/)** (`cloudinary` Node.js SDK)
- **[Supabase](https://supabase.com/)** (`@supabase/supabase-js`)

### Email & Authentication

- **[Resend](https://resend.com/)** & **[React Email](https://react.email/)**
- **[Jose](https://github.com/panva/jose)** (JWT creation and token verification)

### Logging & Utilities

- **[Pino](https://getpino.io/)** (Structured JSON logger)
- **[Dotenv](https://www.npmjs.com/package/dotenv)** & **[TSX](https://github.com/privatenumber/tsx)**
- **[Vercel Analytics](https://vercel.com/analytics)** (`@vercel/analytics`)

---

## Prerequisites

Ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)**: v20.x or higher recommended
- **npm** (v10+), **yarn**, **pnpm**, or **bun**
- **[PostgreSQL](https://www.postgresql.org/)** database instance (local or hosted e.g., Supabase, Neon, Railway)

---

## Getting Started & Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Flico-consultancy
```

### 2. Install Dependencies

Install all required project dependencies (this automatically runs `prisma generate` post-install):

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Open `.env` and fill in the required environment variables:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (`postgres://user:password@host:port/db`) |
| `RESEND_API_KEY` | API Key from Resend for transactional email delivery |
| `JWT_SECRET_KEY` | Secret key used for signed token generation |
| `BASE_URL` | Base URL of the deployed application (e.g. `http://localhost:3000`) |
| `DARAJA_CONSUMER_KEY` | Safaricom Daraja API Consumer Key |
| `DARAJA_CONSUMER_SECRET` | Safaricom Daraja API Consumer Secret |
| `DARAJA_BASE_URL` | Daraja API endpoint (Sandbox or Production) |
| `DARAJA_SHORTCODE` | M-Pesa Business Shortcode / Till Number |
| `DARAJA_PASSKEY` | M-Pesa Online Passkey |
| `DARAJA_PHONE` | Test phone number for STK Push |
| `DARAJA_CALLBACK_URL` | Webhook URL for M-Pesa payment notifications (e.g. ngrok URL during dev) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key |

### 4. Database Setup & Prisma Generation

Generate the custom Prisma Client into `./generated/prisma` and sync the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to PostgreSQL (or run migrations)
npx prisma db push
```

### 5. Run the Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

---

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Generates the Prisma client and builds the application for production deployment.
- `npm start`: Starts the production server after a build.
- `npm run lint`: Runs ESLint to check for code quality and syntax issues.
