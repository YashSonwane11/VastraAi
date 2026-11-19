# VastraAI — AI-Powered Virtual Saree Try-On

> **Tradition, Reimagined with AI.**
> *Experience Your Look Before You Wear It.*

VastraAI is a luxury Indian fashion demo web application where customers can browse traditional handwoven sarees (Banarasi, Kanjivaram, Paithani, Organza, Velvet, etc.), select any garment, upload their photograph, and visualize themselves wearing it in seconds through an AI-guided virtual try-on experience.

---

## 🌟 Key Features

1. **Luxury Fashion Showcase**: 12+ handcrafted sarees with detailed specifications (fabrics, weaves, occasions, regions).
2. **Search, Filter & Sorting**: Real-time filtering by colour, fabric, occasion, and price with instant results.
3. **Interactive 3-Step Try-On Wizard**:
   - **Step 1**: Saree Selection & Switcher.
   - **Step 2**: Photo upload with client-side & server-side validation (face guidance, size limit, type checking).
   - **Step 3**: Dynamic animated AI pipeline breakdown (analyzing pose, detecting boundaries, asset mapping, neural draping, and texture refinement).
4. **Side-by-Side Comparison**: Split-screen before & after look comparison on desktop, adaptive stacked layout on mobile.
5. **Virtual Look Locker (History)**: Save looks locally in browser storage with single-click recall and sharing.
6. **Pluggable AI Architecture**: Clean separation between `VirtualTryOnProvider` interface, an interactive `DemoVirtualTryOnProvider` fallback, and ready-to-plug `RealVirtualTryOnProvider` (Fashn.ai / IDM-VTON / Replicate / OOTDiffusion).

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS with custom Indian luxury palette (Saffron, Gold, Pearl, Charcoal)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v7

### Backend
- **Framework**: Python FastAPI
- **Async Handling**: aiofiles, asyncio background tasks
- **Data Validation**: Pydantic v2
- **Image Processing**: Pillow
- **Environment**: python-dotenv

---

## 🚀 Quick Start Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
copy .env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
- **Backend API**: http://localhost:8000
- **Interactive Swagger Docs**: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
- **Frontend App**: http://localhost:5173

---

## 📁 Repository Architecture

```text
VastraAi/
├── WORKFLOW.md                 # System flowcharts & AI pipeline diagrams (Mermaid)
├── README.md                   # Project documentation & setup instructions
│
├── backend/                    # FastAPI REST API & AI Service
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py             # App entry, CORS, and static file mounts
│       ├── api/
│       │   ├── products.py     # Product catalog & query endpoints
│       │   └── virtual_tryon.py# File upload & async try-on processing
│       ├── ai/
│       │   ├── provider.py     # Abstract VirtualTryOnProvider interface
│       │   └── demo_provider.py# Realistic demo simulation & model hooks
│       ├── models/
│       │   └── schemas.py      # Pydantic models for jobs, sarees, fit
│       ├── services/
│       │   ├── product_service.py
│       │   └── tryon_service.py
│       └── data/
│           └── products.py     # Seed catalogue with 12 authentic sarees
│
└── frontend/                   # React + TypeScript + Vite SPA
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── src/
        ├── App.tsx             # Root routing layout
        ├── main.tsx
        ├── index.css           # Global typography & luxury styling utilities
        ├── types/              # TypeScript definitions
        ├── services/           # Axios API connectors
        ├── hooks/              # Custom hooks (e.g., useSavedLooks)
        ├── components/         # Navbar, Footer, ProductCard, Toast, Skeletons
        ├── pages/              # Home, Shop, ProductDetails, VirtualTryOn, TryOnResult, About
        └── data/               # Client-side fallback catalog
```

---

## 🔒 Security & Safe Defaults
- Max file upload size enforced at 10MB.
- Strict MIME-type validation (`image/jpeg`, `image/png`, `image/webp`).
- Background job processing prevents API timeouts.
- Safe client-side fallback guarantees uninterrupted demonstration even if offline.

---

## 📄 License
MIT © 2026 VastraAI.
