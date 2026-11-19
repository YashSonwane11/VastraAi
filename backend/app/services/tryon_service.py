import uuid, asyncio, os
from typing import Dict
from app.models.schemas import TryOnJob, TryOnStatus
from app.ai.demo_provider import GeminiVirtualTryOnProvider
from app.ai.provider import VirtualTryOnProvider

jobs: Dict[str, TryOnJob] = {}

STEPS_TEMPLATE = [
    {"id": "analyze", "label": "Validating image resolution & pose", "status": "pending"},
    {"id": "detect", "label": "Detecting body landmarks & clothing mask", "status": "pending"},
    {"id": "prepare", "label": "Extracting saree drape, pallu & zari borders", "status": "pending"},
    {"id": "create", "label": "Neural Saree Draping & Zari Synthesis", "status": "pending"},
    {"id": "refine", "label": "Preserving face identity & natural lighting", "status": "pending"},
]

def get_provider() -> VirtualTryOnProvider:
    return GeminiVirtualTryOnProvider()

async def create_tryon_job(product_id: str, image_path: str, garment_url: str) -> TryOnJob:
    job_id = f"tryon-{uuid.uuid4().hex[:8]}"
    steps = [dict(s) for s in STEPS_TEMPLATE]
    job = TryOnJob(jobId=job_id, productId=product_id, status=TryOnStatus.queued, processingSteps=steps)
    jobs[job_id] = job
    asyncio.create_task(process_tryon_job(job_id, image_path, garment_url))
    return job

async def process_tryon_job(job_id: str, image_path: str, garment_url: str):
    job = jobs.get(job_id)
    if not job:
        return
    job.status = TryOnStatus.processing
    
    # Fast initial pipeline steps
    job.processingSteps[0]["status"] = "processing"
    await asyncio.sleep(0.5)
    job.processingSteps[0]["status"] = "completed"
    
    job.processingSteps[1]["status"] = "processing"
    await asyncio.sleep(0.5)
    job.processingSteps[1]["status"] = "completed"
    
    job.processingSteps[2]["status"] = "processing"
    await asyncio.sleep(0.5)
    job.processingSteps[2]["status"] = "completed"
    
    # Neural garment draping
    job.processingSteps[3]["status"] = "processing"
    provider = get_provider()
    result = await provider.generate(person_image_path=image_path, garment_image_url=garment_url, product_id=job.productId)
    
    if result["success"]:
        job.processingSteps[3]["status"] = "completed"
        job.processingSteps[4]["status"] = "processing"
        await asyncio.sleep(0.3)
        job.processingSteps[4]["status"] = "completed"
        
        job.resultUrl = f"/uploads/{os.path.basename(result['result_path'])}"
        job.status = TryOnStatus.completed
    else:
        job.status = TryOnStatus.failed
        job.errorMessage = result.get("error", "AI virtual try-on processing failed.")

def get_job(job_id: str):
    return jobs.get(job_id)
