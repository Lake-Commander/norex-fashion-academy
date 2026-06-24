# Norex Atelier

### Architectural African Heritage & Premium E-Commerce Ecosystem

Norex Atelier is a luxury, performance-engineered e-commerce platform designed for premium ready-to-wear fashion, bespoke tailoring, and made-to-measure African heritage garments. The platform combines modern commerce architecture with cultural storytelling, delivering a seamless shopping experience backed by enterprise-grade infrastructure.

Built with scalability, performance, and maintainability in mind, Norex Atelier integrates advanced catalog management, secure payment verification, customer analytics, academy learning resources, and administrative control systems.

---

## Features

### Luxury Fashion Commerce

* Ready-to-Wear Collections
* Bespoke & Made-to-Measure Orders
* Seasonal Campaigns & Editorial Showcases
* Product Variants (Size, Color, Fabric)
* Product Reviews & Ratings
* Related Product Recommendations

### Customer Experience

* User Authentication
* User Dashboard
* Wishlist Management
* Shopping Cart
* Secure Checkout
* Order Tracking
* Purchase History
* Profile Management

### Norex Academy

A dedicated learning ecosystem providing:

* Fashion Education Resources
* African Heritage Fashion Insights
* Design & Styling Content
* Editorial Publications
* Learning Modules

### Administrative Control Center

* Admin Dashboard
* Product Management
* Order Management
* Customer Management
* Review Moderation
* Campaign Management
* Analytics Monitoring
* Inventory Control

### Analytics & Telemetry

* Product Impression Tracking
* Customer Engagement Monitoring
* View Duration Analytics
* Fashion Film Analytics
* Behavioral Insights Collection

---

# Technology Stack

| Layer           | Technology                 |
| --------------- | -------------------------- |
| Framework       | Next.js 14+ (App Router)   |
| Language        | TypeScript                 |
| Database        | MongoDB                    |
| ODM             | Mongoose                   |
| Styling         | Tailwind CSS + CSS Modules |
| Authentication  | NextAuth.js                |
| Payment Gateway | Paystack                   |
| Media Storage   | Cloudinary                 |
| Email Services  | Brevo                      |
| Icons           | Lucide React               |
| Deployment      | Vercel                     |

---

# Architectural Highlights

## Hardened Payment Verification System

### `/api/checkout/verify`

The checkout verification service employs multiple validation layers to ensure secure transaction processing.

Features include:

* Token normalization using `.trim()`
* Transaction reference sanitization
* Context-aware verification matching
* Duplicate payment prevention
* Secure database transaction logging
* Automated order creation after successful verification

---

## Multi-Viewport Responsive Architecture

### Dynamic Fluid Grid System

The platform uses a fully responsive layout architecture designed to eliminate viewport overflow issues.

Features:

* Mobile-first responsive design
* Fluid container scaling
* Horizontal overflow prevention
* Optimized image rendering
* Responsive typography using CSS clamp()

```css
width: 100%;
overflow-x: hidden;
```

### Adaptive Product Actions

Desktop Experience:

* Hover-based action overlays
* Elegant product interactions
* Minimal visual noise

Mobile Experience:

* Persistent action bars
* Touch-optimized controls
* Improved accessibility

### Responsive Navigation

Desktop:

* Multi-column category navigation
* Inline filtering controls

Mobile:

* Compact dropdown selectors
* Simplified filtering experience
* Optimized touch targets

---

## Integrated Telemetry Pipeline

The analytics engine collects customer engagement metrics without impacting performance.

Tracked Events:

* Product impressions
* Product views
* Session duration
* Fashion film interactions
* Cart activities
* Wishlist engagements
* Conversion events

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Lake-Commander/norex-fashion-academy.git
cd norex-fashion
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:3000
```

---

# Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/norexfashion

# Authentication
ADMIN_EMAIL=name@example.com
ADMIN_PASSWORD=Adminpassword
NEXTAUTH_SECRET=your-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=cloudinary_ID
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Brevo
BREVO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=name@example.com
```

---

# Project Structure

```plaintext
norex-fashion/
│
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── verify/
│   │   │
│   │   ├── admin/
│   │   │   └── products/
│   │   │
│   │   └── reviews/
│   │
│   ├── shop/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │
│   ├── dashboard/
│   │
│   ├── admin/
│   │
│   ├── academy/
│   │
│   ├── wishlist/
│   │
│   ├── cart/
│   │
│   └── campaigns/
│
├── components/
│
├── context/
│   └── ShopContext.tsx
│
├── hooks/
│   └── useTelemetry.ts
│
├── lib/
│   ├── models/
│   ├── dbConnect.ts
│   ├── auth.ts
│   └── utils.ts
│
├── public/
│
├── styles/
│
└── middleware.ts
```

---

# Core Modules

## Shop

Luxury shopping experience with advanced filtering, sorting, and product discovery.

## Cart

Persistent cart management with quantity control and checkout integration.

## Wishlist

Allows customers to save products for future purchases.

## User Dashboard

Centralized customer portal for:

* Orders
* Saved Items
* Profile Information
* Address Management
* Purchase History

## Admin Dashboard

Comprehensive management center for:

* Products
* Orders
* Customers
* Reviews
* Analytics
* Campaigns

## Academy

Educational platform focused on:

* Fashion Knowledge
* African Heritage Design
* Styling Resources
* Editorial Publications

---

# Security Features

* Secure Authentication
* NextAuth Session Management
* Protected Admin Routes
* Environment Variable Protection
* Payment Verification Layer
* Input Sanitization
* Transaction Validation
* MongoDB Schema Validation

---

# Performance Optimizations

* Next.js App Router
* Server Components
* Dynamic Imports
* Image Optimization
* Edge Runtime Support
* MongoDB Indexing
* Lazy Loading
* Responsive Asset Delivery

---

# Future Roadmap

* AI Fashion Recommendations
* Advanced Measurement Engine
* Tailor Portal
* Customer Loyalty Program
* Referral System
* Multi-Currency Support
* International Shipping Integration
* Fashion Consultation Booking

---

# Contributing

Contributions, improvements, and architectural suggestions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# License

This project is licensed under the MIT License.

---

## Norex Atelier

**Where African Heritage Meets Modern Digital Luxury.**
