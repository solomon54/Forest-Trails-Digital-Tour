# Forest Trails Digital Tour

![Forest Trails Banner](public/images/hero.jpg) <!-- Assuming a banner image exists; replace with actual path if needed -->

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/solomon54/Forest-Trails-Digital-Tour/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

A **Decentralized Wildlife Content Moderation and Synchronization System** for Ethiopia's Remote Reserves. This project addresses infrastructure challenges in Ethiopian national parks by enabling offline data collection, distributed moderation, and real-time synchronization for conservation, research, and eco-tourism.

## 📋 Executive Summary

Ethiopian national parks and reserves, spanning remote highlands and forests, are rich in biodiversity but plagued by unvisited areas due to poor infrastructure: unreliable roads, limited mobile coverage, and isolated ranger stations hinder data collection for conservation, scientific research, and eco-tourism. This leads to fragmented information, delayed habitat monitoring, and untapped potential for virtual exploration amid threats like climate change and habitat degradation.

Forest Trails Digital Tour tackles this with a decentralized setup suited to Ethiopia's realities: asynchronous queues support offline submissions (such as animal sightings or trail photos from field rangers or visitors), distributed admin moderation ensures quality (approving useful content while removing outdated or irrelevant items like old event videos), and vetted material syncs to a public dashboard for broad access. By emphasizing tolerance for network disruptions in low-connectivity zones, the system overcomes centralization pitfalls, enabling seamless sharing from isolated spots to urban researchers.

The system highlights core distributed principles:

1. **Partition Tolerance** 🔌: Offline field nodes store data during extended periods without signal in remote highland forests, syncing only when connectivity returns at outposts.
2. **Concurrency Control** ⚙️: Multiple admins, such as staff from the Ethiopian Wildlife Conservation Authority (EWCA) offices in regional hubs, handle submissions in parallel through queues to prevent overlaps in under-resourced environments.
3. **Replication & Fault Tolerance** 🛡️: Data copies across hubs; failures like power cuts in distant stations prompt automatic retries, safeguarding information in Ethiopia's variable conditions.
4. **Scalability** 📈: Nodes can expand easily for growing reserves or new eco-initiatives.

## 🎯 Objectives

- Support offline contributions from Ethiopia's remote, under-visited reserves to aid conservation research and virtual recreation.
- Streamline distributed moderation for quick approval of valuable content (e.g., wildlife sightings for mapping) and removal of outdated items despite infrastructure delays.
- Offer a reliable public dashboard for real-time access, closing gaps between rural field data and national biodiversity efforts.

## ✨ Features

- **Offline-First PWA** 📱: Progressive Web App with service workers for offline functionality, ideal for field rangers in remote areas.
- **Real-Time Synchronization** 🔄: Socket.io and Pusher for live updates, activity feeds, and concurrency locks during moderation.
- **Distributed Moderation** 👥: Admin dashboard with resource queues, activity logs, and role-based access (e.g., super admins oversee locks).
- **Secure Authentication** 🔒: JWT-based auth with bcrypt hashing, bilateral validation (frontend/backend).
- **Media Uploads & Management** 📸: Cloudinary integration for photos/videos of trails and wildlife, with progress tracking.
- **Data Visualization & Dashboards** 📊: Recharts for stats, activity feeds, and mini sparklines.
- **User-Friendly UI** 🎨: Tailwind CSS, Framer Motion animations, skeleton loaders for smooth UX.
- **Booking & Review System** ⭐: Integrated forms for tour bookings, reviews, and availability checks.
- **Custom Server** 🖥️: Node.js with Express-like handling for WebSockets and API routes.

## 🛠️ Tech Stack

| Category             | Technologies/Tools                                                                  |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Frontend**         | Next.js (Pages Router), React, TypeScript, Tailwind CSS, Framer Motion, React Icons |
| **State Management** | Redux Toolkit (slices for users, bookings, notifications)                           |
| **Backend/Database** | Node.js, Sequelize, MySQL2, JWT, Bcrypt                                             |
| **Real-Time**        | Socket.io, Pusher                                                                   |
| **Media/Storage**    | Cloudinary                                                                          |
| **Data Fetching**    | Axios, SWR                                                                          |
| **Charts/UI Libs**   | Recharts, Lucide React, Heroicons                                                   |
| **PWA/Offline**      | Service Workers, Manifest.json, Offline Fallback                                    |
| **Utilities**        | Lodash, Moment, Clsx, Class-Variance-Authority                                      |
| **Dev Tools**        | ESLint, PostCSS, TypeScript Config                                                  |

## 📂 Project Structure

The project uses a modular, feature-based architecture for maintainability.

```
.
├── README.md                  # Project documentation
├── certs/                     # Certificates (e.g., ca.pem for secure connections)
├── components/                # Reusable UI components, organized by domain
│   ├── InstallPWA.tsx         # PWA installation prompt
│   ├── admin/                 # Admin-specific components (e.g., ActivityFeed.tsx, Dashboard.tsx)
│   ├── auth/                  # Authentication forms (LoginForm.tsx, SignupForm.tsx)
│   ├── buttons/               # Button components
│   ├── cards/                 # Card UI (BookingCard.tsx, DestinationCard.tsx)
│   ├── landing/               # Landing page sections (HeroSection.tsx, Testimonials.tsx)
│   ├── layout/                # Layout wrappers (AdminLayout.tsx, Footer.tsx)
│   ├── navbar/                # Navigation bar
│   ├── property/              # Property/tour details (BookingForm.tsx, ReviewForm.tsx)
│   ├── skelotons/             # Skeleton loaders for UX
│   ├── uploads/               # Upload-related components (UploadForm.tsx, FilePicker.tsx)
│   └── users/                 # User profile components
├── eslint.config.mjs          # ESLint configuration
├── hooks/                     # Custom React hooks (useAuth.ts, useBookings.ts)
├── lib/                       # Utilities and libraries
│   ├── auth.ts                # Authentication logic
│   ├── cloudinary.ts          # Cloudinary integration
│   ├── db.ts                  # Database connection
│   ├── email.ts               # Email services (Resend)
│   ├── online-presence/       # Socket.io setup (socketAuth.ts, sockets.ts)
│   └── pusher.ts              # Pusher integration
├── models/                    # Database models (Sequelize)
│   ├── Booking.ts             # Booking model
│   ├── Listing.ts             # Trail/listing model
│   ├── User.ts                # User model
│   └── adminService.ts        # Admin services
├── next-env.d.ts              # Next.js TypeScript env
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── pages/                     # Next.js pages and API routes
│   ├── 404.tsx                # Custom 404 page
│   ├── admin/                 # Admin dashboard pages (activity-log.tsx, bookings/)
│   ├── api/                   # API endpoints (auth/login.ts, bookings/index.ts)
│   ├── index.tsx              # Home page
│   ├── tours/                 # Tour pages ([id].tsx)
│   └── uploads/               # Upload page
├── postcss.config.mjs         # PostCSS config for Tailwind
├── public/                    # Static assets
│   ├── icons/                 # PWA icons and manifest
│   ├── images/                # Images and videos (hero.jpg, Semien.mp4)
│   ├── manifest.json          # PWA manifest
│   ├── offline.html           # Offline fallback page
│   └── sw.js                  # Service Worker
├── server.ts                  # Custom server with Socket.io
├── services/                  # API clients and services (adminService.ts, bookingService.ts)
├── store/                     # Redux store
│   ├── slices/                # Redux slices (bookingSlice.ts, userSlice.ts)
├── styles/                    # CSS styles (globals.css, tailwind.css)
├── tsconfig.json              # TypeScript configuration
└── types/                     # TypeScript types (booking.ts, notification.ts)
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MySQL database
- Environment variables (create `.env` from `.env.example` if available)

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/solomon54/Forest-Trails-Digital-Tour.git
   cd digital-tour
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up database (run migrations if using Sequelize):
   ```bash
   npx sequelize-cli db:migrate
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

- Build: `npm run build`
- Start: `npm run start`
- Recommended Deployment: Vercel (PWA-friendly)

## 📖 Usage

- **Admin Dashboard**: Access at `/admin` for moderation, activity logs, and resource management.
- **Uploads**: Field users upload content offline via PWA; syncs on reconnect.
- **Public Tours**: Browse trails at `/tours` with real-time updates.
- **Real-Time Features**: Admins see live activity; use Socket.io for concurrency control.

For detailed API docs, check `/pages/api/` endpoints.

## 🤝 Contributing

Contributions welcome! Fork the repo, create a branch, and submit a PR. Follow code style with ESLint.

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

- **Solomon Tsehay**  
  ID: 1501288  
  GitHub: [solomon54](https://github.com/solomon54)  
  Contact: [Your Email or LinkedIn]

---

🌿 Built with passion for Ethiopia's biodiversity. Let's conserve our forests! 🇪🇹
