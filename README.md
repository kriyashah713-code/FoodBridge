# FoodBridge – Food Waste Reduction & Donation System

> **Academic Engineering Capstone Project**  
> *Third-Year B.Tech Computer Engineering*  
> Built with **React 18, TypeScript, Vite, React Router 6, and Supabase PostgreSQL**.

---

## 📌 Project Overview

**FoodBridge** is a full-stack web application designed to combat food insecurity and mitigate organic landfill waste. It bridges the critical operational gap between commercial food establishments (caterers, wedding banquets, restaurants, and grocery retailers) with verified non-governmental organizations (NGOs), community kitchens, and homeless shelters.

The platform provides an auditable, real-time logistics workflow that ensures food is routed, inspected, and collected within strict **Safe Pickup Deadlines** before quality degrades.

---

## 🎨 Color Palette & Design System

The application strictly implements a friendly, readable student-engineered palette with subtle shadows, clean cards, and responsive CSS:

| Element | Color Hex | Role |
| :--- | :--- | :--- |
| **Mint Green** | `#BFE8D0` | Primary accents, status badges, active indicators |
| **Dark Green** | `#26734D` | Brand identity, primary CTA buttons, active navigation, headers |
| **Soft Peach** | `#FFD6C2` | Expiry alerts, urgency indicators, secondary actions |
| **Light Lavender** | `#E8DFF5` | Category tags, subtle card backgrounds |
| **White** | `#FFFFFF` | Primary surface cards, form elements, clean backgrounds |

---

## 🚀 Tech Stack

- **Frontend:** React 18 with TypeScript (`.tsx`)
- **Build Tool:** Vite 6
- **Routing:** React Router DOM 6
- **Icons:** Lucide React
- **Styling:** Custom CSS Design System with responsive grid breakpoints
- **Backend / Database:** Supabase (PostgreSQL with Row-Level Security and Auth Triggers)
- **Version Control:** Git

---

## 📑 13 Required Pages & Routing Map

| # | Page | Route | Access Level | Description |
|---|---|---|---|---|
| 1 | **Home** | `/` | Public | Hero with impact counters, working category cards, live surplus preview, and multi-step process overview. |
| 2 | **Login** | `/login` | Public | Role-aware login with one-click demo credentials for quick academic evaluation. |
| 3 | **Sign Up** | `/signup` | Public | Registration supporting both Food Donors and Certified NGOs with organization and address fields. |
| 4 | **Donate Food** | `/donate-food` | Donor / Admin | Comprehensive listing form: food name, category, quantity, unit, preparation time, safe deadline, location, dietary type, and storage instructions. |
| 5 | **Available Food** | `/available-food` | Public | Real-time search and filter engine (by category, dietary preference, city, urgency window, and sorting). |
| 6 | **Food Details** | `/food/:id` | Public | Deep dive listing view with countdown timer, donor profile, safety pledge, and action triggers. |
| 7 | **Pickup Request** | `/pickup-request/:id` | NGO / Admin | Logistics submission form for NGOs: quantity needed, vehicle arrival estimate, driver contact, and distribution notes. |
| 8 | **Donor Dashboard** | `/donor-dashboard` | Donor / Admin | Donor portal: metrics, incoming pickup request approvals/rejections with custom notes, and listing management. |
| 9 | **NGO Dashboard** | `/ngo-dashboard` | NGO / Admin | NGO rescue portal: active pickup status tracking, unlocked direct donor contacts upon acceptance, and local surplus discovery. |
| 10 | **Admin Dashboard** | `/admin-dashboard` | Admin Only | Administrative control: user directory, listing moderation/purge, pickup audit log, and contact inquiry resolver. |
| 11 | **Donation History** | `/donation-history` | Public | Complete immutable archive of fulfilled, claimed, and closed donations with printable receipt summary. |
| 12 | **About Us** | `/about` | Public | Academic capstone details, UN Sustainable Development Goals (SDG 2: Zero Hunger & SDG 12: Responsible Consumption), and safety pledge. |
| 13 | **Contact Us** | `/contact` | Public | Working contact form submitting to `contact_messages` table, direct helpline info, and interactive FAQ accordion. |

---

## 🗄️ Database Architecture & Supabase Schema

The database is built on PostgreSQL with foreign-key constraints, triggers, and Row-Level Security (RLS) policies. The SQL script is located at `supabase/schema.sql`.

### Tables:

1. **`profiles`**
   - Linked directly to `auth.users(id)` via `ON DELETE CASCADE`.
   - Stores `email`, `full_name`, `role` (`donor` \| `ngo` \| `admin`), `phone`, `organization_name`, `address`, `city`.
   - Managed automatically via the `handle_new_user()` trigger on user registration.

2. **`donations`**
   - Primary table for surplus meals.
   - Stores `donor_id`, `food_name`, `category`, `quantity`, `unit`, `dietary_type`, `location`, `city`, `preparation_time`, `safe_pickup_deadline`, `storage_instructions`, `description`, `status` (`available` \| `requested` \| `claimed` \| `completed` \| `cancelled` \| `expired`).
   - Constraint: `CONSTRAINT deadline_after_prep CHECK (safe_pickup_deadline > preparation_time)`.

3. **`pickup_requests`**
   - Connects an NGO to a donation listing.
   - Stores `donation_id`, `ngo_id`, `donor_id`, `quantity_requested`, `estimated_pickup_time`, `message`, `contact_person`, `contact_phone`, `status` (`pending` \| `accepted` \| `rejected` \| `completed` \| `cancelled`), `donor_note`.

4. **`contact_messages`**
   - Inquiries submitted from `/contact`.
   - Stores `name`, `email`, `subject`, `message`, `status` (`unread` \| `read` \| `resolved`).

### Row-Level Security (RLS) Rules:
- **Donors:** Can create, update, and manage only their own donations.
- **NGOs:** Can view available donations and create pickup requests.
- **Admin:** Protected helper `is_admin()` function allows administrators to oversee and moderate all records while ordinary users cannot access admin capabilities.
- **Anon Public:** Can view active donations and submit contact inquiries.
- **Security:** The frontend only uses `VITE_SUPABASE_ANON_KEY`. The `service_role` key is never exposed.

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher; tested on Node v24)
- npm or pnpm

### 1. Clone & Install Dependencies
\`\`\`bash
git clone <repository-url>
cd <project-folder>
npm install
\`\`\`

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

Open `.env` and fill in your Supabase credentials:
\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

> **Note on Standalone / Demo Mode:**  
> If `.env` credentials are not configured yet, FoodBridge automatically operates in an interactive local mode. All 13 pages, forms, workflows, calculations, and role switching function seamlessly with local reactive persistence. When you provide live Supabase credentials, the app connects directly to PostgreSQL.

### 3. Initialize Supabase Database
1. Go to your Supabase Project Dashboard at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy the full content of `supabase/schema.sql` and click **Run**.
4. The schema, indexes, RLS policies, and user creation triggers will be configured automatically.

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
The application will launch at `http://localhost:5173`.

### 5. Build for Production
\`\`\`bash
npm run build
\`\`\`
The optimized static bundle will be generated in `dist/`.

---

## 🧪 Testing the Complete Workflow

You can verify the end-to-end flow either via the interactive UI or via the automated verification scripts:

### Interactive UI Walkthrough:
1. **Donor Flow:**
   - Log in using Donor demo (`donor@foodbridge.org`) or click the **Role: Donor** pill in the top navigation.
   - Navigate to **Donate Food** (`/donate-food`).
   - Create a food listing (e.g., 50 servings of Vegetable Pulao).
   - Verify it appears on **Available Food** (`/available-food`) and in the **Donor Dashboard** (`/donor-dashboard`).
2. **NGO Flow:**
   - Switch role to **NGO** using the navigation pill or login (`ngo@foodbridge.org`).
   - Go to **Available Food** (`/available-food`), locate the donation, and click **Request Pickup** (`/pickup-request/:id`).
   - Enter requested quantity, driver contact, and estimated arrival time, then submit.
   - Verify the request appears under "Pending" in the **NGO Dashboard** (`/ngo-dashboard`).
3. **Donor Acceptance Flow:**
   - Switch back to **Donor** and open the **Donor Dashboard**.
   - Under **Incoming Pickup Requests**, review the NGO request and click **Accept & Confirm Pickup**. Add an optional gate instruction.
   - Notice the listing status immediately updates to `claimed`.
4. **Fulfillment:**
   - Under either the Donor or NGO Dashboard, mark the item as **Completed**.
   - Check **Donation History** (`/donation-history`) to see the verified transaction in the public audit ledger with environmental CO₂ offset metrics.
5. **Safe Expiry Verification:**
   - Any food listing whose `safe_pickup_deadline` has passed automatically transitions to `expired` status and disables pickup requests.

### Automated Script Verification:
\`\`\`bash
node scripts/test-workflow.js
node scripts/verify-workflow.js
\`\`\`

---

## 🌐 Deployment Instructions

FoodBridge is structured as a single-page application (SPA) optimized for deployment on Vercel, Netlify, Render, or Supabase Hosting.

### Deploying on Vercel
1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and import your repository.
3. Configure the build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `<your-supabase-url>`
   - `VITE_SUPABASE_ANON_KEY` = `<your-anon-key>`
5. Click **Deploy**.

### Deploying on Netlify
1. Create a `public/_redirects` file with the rule:
   \`\`\`
   /*    /index.html   200
   \`\`\`
2. Set Build Command: `npm run build`
3. Set Publish directory: `dist`
4. Set Environment Variables in Netlify Settings → Build & Deploy.

---

## 📄 License & Academic Attribution
Developed as an academic capstone web engineering project by a Third-Year B.Tech Computer Engineering student. Built with ethical, open-source principles to advance UN Sustainable Development Goals 2 & 12.
