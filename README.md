# Norex Atelier — Architectural African Heritage & Premium E-Commerce Ecosystem

Norex Atelier is a luxury, hyper-optimized e-commerce platform built specifically for ready-to-wear expressions and bespoke, made-to-measure African heritage garments. Engineered with standard-setting performance, architectural layout systems, structural database models, and automated payment synchronizations.

##  Architectural Tech Stack

*   **Framework:** Next.js 14+ (App Router architecture with Serverless Edge Runtime bindings)
*   **Language:** TypeScript (Strict runtime typing configurations)
*   **Database:** MongoDB via Mongoose ODM (Resilient multi-model indexation structures)
*   **Styling:** Scoped CSS Modules & Tailwind CSS (Fluid responsive clamp parameters)
*   **Gateways:** Paystack API Integration (Native validation handshake cycles)
*   **Icons:** Lucide React

---

##  Key System Features

### 1. Hardened Verification Loop (`/api/checkout/verify`)
Features a proactive security and string cleaning mechanism. Bypasses trailing whitespace or newline characters added during pasting cycles by processing tokens via `.trim()`. Bypasses transaction verification drops by comparing context target boundaries against custom field matrices before executing database inserts.

### 2. Multi-Viewport Responsive Layout
*   **Dynamic Fluid Grid Architecture:** Completely eliminates horizontal screen swaying on mobile viewports by mapping responsive container constraints (`width: 100%; overflow-x: hidden;`).
*   **Context Action Toggle:** On desktop screens, interactive controls (Add to Basket, Details, Wishlist) render elegantly within absolute hover overlays (`.sco`). On mobile viewports, these transition into permanent, touch-friendly persistent action bars underneath thumbnails.
*   **Adaptive Navigation Controls:** Filters and gender tab rows automatically condense into clear, minimal select dropdown selectors on mobile interfaces, while mapping back into side-by-side matrices for desktop displays.

### 3. Integrated Telemetry Pipeline
Tracks product impressions, view duration parameters, and fashion-film streams seamlessly to profile consumer history models without performance drops.

---

## Installation & Local Environment Matrix

### 1. Clone the Architecture
```bash
git clone [https://github.com/Lake-Commander/norex-fashion-academy.git](https://github.com/Lake-Commander/norex-fashion-academy.git)
cd norex-fashion


Then

```bash
npm install
npm run dev

---

Create a .env.local file in the root context directory and establish the environmental mapping exactly as structured below:

# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/norexfashion

# Admin amd Auth Credentials
ADMIN_EMAIL=name@memxample.co
ADMIN_PASSWORD=Adminpassword
NEXTAUTH_SECRET=your-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Paystack Key Infrastructure (Ensure token target matching)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=cloudinary_ID
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=Jxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Developer Credentials Cluster
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# BREVO API KEY
BREVO_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=name@example.com

### Core folders

├── app/
│   ├── api/
│   │   ├── checkout/verify/     # Paystack transaction verification node
│   │   ├── admin/products/      # Master catalog CRUD operations
│   │   └── reviews/             # Critique ledger aggregation loops
│   ├── shop/
│   │   ├── page.tsx             # Main collection catalog area
│   │   └── [slug]/              # Rigid single item breakdown stage
│   └── campaigns/               # Seasonal editorial directory routes
├── context/
│   └── ShopContext.tsx          # Global cart and registry lifecycle state
├── hooks/
│   └── useTelemetry.ts          # Customer viewing analytics interface
└── lib/
    ├── models/                  # Strict Mongoose schema configurations
    └── utils.ts                 # Naira string normalization hooks