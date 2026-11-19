import os, uuid
import aiofiles
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import TryOnResponse, TryOnStatusResponse, TryOnStatus
from app.services.tryon_service import create_tryon_job, get_job
from app.services.product_service import get_product_by_id

router = APIRouter()
ALLOWED_TYPES = {"image/jpeg","image/jpg","image/png","image/webp"}

@router.post("/virtual-try-on", response_model=TryOnResponse)
async def start_virtual_tryon(productId: str = Form(...), image: UploadFile = File(...)):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload JPG, PNG, or WebP.")
    product = get_product_by_id(productId)
    if not product: raise HTTPException(status_code=404, detail=f"Product {productId} not found")
    content = await image.read()
    max_size = int(os.getenv("MAX_FILE_SIZE_MB","10")) * 1024 * 1024
    if len(content) > max_size:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    os.makedirs("uploads", exist_ok=True)
    filename = f"person_{uuid.uuid4().hex}_{image.filename}"
    file_path = os.path.join("uploads", filename)
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    job = await create_tryon_job(product_id=productId, image_path=file_path, garment_url=product.tryOnAsset)
    return TryOnResponse(success=True, jobId=job.jobId, status=job.status,
                         message="Virtual try-on started. Poll status endpoint for updates.")

@router.get("/virtual-try-on/{job_id}", response_model=TryOnStatusResponse)
async def get_tryon_status(job_id: str):
    job = get_job(job_id)
    if not job: raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    resp = TryOnStatusResponse(jobId=job.jobId, status=job.status, resultUrl=job.resultUrl,
                               errorMessage=job.errorMessage, processingSteps=job.processingSteps)
    if job.status == TryOnStatus.completed:
        resp.estimatedFit = {"size":"Free Size","confidence":"High","note":"This saree suits most body types."}
    return resp
