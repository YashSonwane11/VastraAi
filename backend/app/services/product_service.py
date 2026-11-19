from typing import List, Optional
from app.data.products import PRODUCTS
from app.models.schemas import Product

def get_all_products(colour=None, fabric=None, occasion=None, style=None,
                     min_price=None, max_price=None, featured=None, search=None) -> List[Product]:
    results = PRODUCTS.copy()
    if colour: results = [p for p in results if colour.lower() in p["colour"].lower()]
    if fabric: results = [p for p in results if fabric.lower() in p["fabric"].lower()]
    if occasion: results = [p for p in results if occasion.lower() in p["occasion"].lower()]
    if style: results = [p for p in results if style.lower() in p["style"].lower()]
    if min_price is not None: results = [p for p in results if p["price"] >= min_price]
    if max_price is not None: results = [p for p in results if p["price"] <= max_price]
    if featured is not None: results = [p for p in results if p["featured"] == featured]
    if search:
        s = search.lower()
        results = [p for p in results if s in p["name"].lower() or s in p["colour"].lower()
                   or s in p["fabric"].lower() or s in p["occasion"].lower()
                   or any(s in t for t in p["tags"])]
    return [Product(**p) for p in results]

def get_product_by_id(product_id: str) -> Optional[Product]:
    for p in PRODUCTS:
        if p["id"] == product_id:
            return Product(**p)
    return None
