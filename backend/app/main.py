import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from app.api import products, virtual_tryon

load_dotenv()

app = FastAPI(title="VastraAI API", description="AI-powered Virtual Saree Try-On API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(virtual_tryon.router, prefix="/api", tags=["virtual-tryon"])

@app.get("/")
async def root():
    return {"message": "VastraAI API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
