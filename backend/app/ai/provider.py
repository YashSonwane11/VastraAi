from abc import ABC, abstractmethod

class VirtualTryOnProvider(ABC):
    @abstractmethod
    async def generate(self, person_image_path: str, garment_image_url: str, product_id: str) -> dict:
        raise NotImplementedError
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        raise NotImplementedError
