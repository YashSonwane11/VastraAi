# VastraAI — System Architecture & Workflow Specifications

## 1. Customer Journey Flowchart

```mermaid
flowchart TD
    A[Customer Opens VastraAI] --> B[Browse Saree Collection]
    B --> C[Select Saree]
    C --> D[View Product Details]
    D --> E[Click Virtual Try-On]
    E --> F[Upload Photo]
    F --> G[Validate Image]
    G --> H{Valid Photo?}
    H -->|No| I[Show Error / Upload Guidance]
    I --> F
    H -->|Yes| J[Send Photo + Saree to AI API]
    J --> K[AI Person Analysis]
    K --> L[Saree Asset Processing]
    L --> M[Virtual Try-On Model]
    M --> N[Image Refinement]
    N --> O[Quality Check]
    O --> P[Generate Virtual Result]
    P --> Q[Display Result]
    Q --> R[Try Another Saree]
    Q --> S[Save / Share Look]
    R --> C
```

---

## 2. AI Processing Pipeline Flowchart

```mermaid
flowchart LR
    A[Customer Photo] --> B[Image Validation]
    B --> C[Person Detection]
    C --> D[Pose Analysis]
    D --> E[Human Representation]
    F[Selected Saree] --> G[Garment Image Processing]
    G --> H[Garment Representation]
    E --> I[AI Virtual Try-On]
    H --> I
    I --> J[Image Refinement]
    J --> K[Quality Check]
    K --> L[Final Try-On Image]
```

---

## 3. Website Page Routing & Hierarchy

```mermaid
flowchart TD
    A[Home /] --> B[Shop /shop]
    B --> C[Product Details /product/:id]
    C --> D[Virtual Try-On /virtual-try-on]
    D --> E[Upload Photo]
    E --> F[AI Processing]
    F --> G[Try-On Result /try-on/result/:id]
    G --> H[Try Another Saree]
    G --> I[Save Look to Locker]
    G --> J[Return to Product]
```

---

## 4. Multi-Stage Try-On Architecture Breakdown

```text
┌─────────────────┐       ┌────────────────────────┐       ┌───────────────────────┐
│                 │  POST │                        │       │                       │
│  React Frontend │ ────> │  FastAPI Backend API   │ ────> │  TryOnService Queue   │
│  (/virtual-try) │       │  (/api/virtual-try-on) │       │  (Asyncio Background) │
│                 │ <──── │                        │       │                       │
└─────────────────┘ 200 OK└────────────────────────┘       └───────────┬───────────┘
         │                                                             │
         │ Poll status                                                 ▼
         │ (/api/virtual-try-on/:id)                     ┌───────────────────────────┐
         ▼                                               │                           │
┌─────────────────┐                                      │ VirtualTryOnProvider      │
│                 │                                      │ (Demo / Real IDM-VTON)    │
│  TryOnResult    │ <────────────────────────────────────┤                           │
│  (/try-on/...)  │            Completed Job             └───────────────────────────┘
└─────────────────┘
```
