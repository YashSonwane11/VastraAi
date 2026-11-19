from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class TryOnStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"

class Product(BaseModel):
    id: str
    name: str
    price: int
    colour: str
    fabric: str
    occasion: str
    style: str
    description: str
    image: str
    gallery: List[str] = []
    tryOnAsset: str
    tags: List[str] = []
    featured: bool = False

class TryOnRequest(BaseModel):
    productId: str
    imageUrl: str

class TryOnJob(BaseModel):
    jobId: str
    productId: str
    status: TryOnStatus
    resultUrl: Optional[str] = None
    errorMessage: Optional[str] = None
    processingSteps: Optional[List[dict]] = None

class TryOnResponse(BaseModel):
    success: bool
    jobId: str
    status: TryOnStatus
    message: Optional[str] = None

class TryOnStatusResponse(BaseModel):
    jobId: str
    status: TryOnStatus
    resultUrl: Optional[str] = None
    errorMessage: Optional[str] = None
    processingSteps: Optional[List[dict]] = None
    estimatedFit: Optional[dict] = None
