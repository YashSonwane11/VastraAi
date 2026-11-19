from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.services.product_service import get_all_products, get_product_by_id
from app.models.schemas import Product

router = APIRouter()

@router.get("/products", response_model=List[Product])
async def list_products(
    colour: Optional[str] = Query(None), fabric: Optional[str] = Query(None),
    occasion: Optional[str] = Query(None), style: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None), max_price: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None), search: Optional[str] = Query(None),
    sort: Optional[str] = Query("recommended"),
):
    products = get_all_products(colour=colour, fabric=fabric, occasion=occasion, style=style,
                                min_price=min_price, max_price=max_price, featured=featured, search=search)
    if sort == "price_asc": products.sort(key=lambda p: p.price)
    elif sort == "price_desc": products.sort(key=lambda p: p.price, reverse=True)
    elif sort == "newest": products.reverse()
    return products

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = get_product_by_id(product_id)
    if not product: raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    return product
