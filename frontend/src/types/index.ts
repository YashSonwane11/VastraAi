export interface Product {
  id: string;
  name: string;
  price: number;
  colour: string;
  fabric: string;
  occasion: string;
  style: string;
  description: string;
  image: string;
  gallery: string[];
  tryOnAsset: string;
  tags: string[];
  featured: boolean;
}

export interface TryOnJob {
  jobId: string;
  productId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  errorMessage?: string;
  processingSteps?: ProcessingStep[];
  estimatedFit?: EstimatedFit;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface EstimatedFit {
  size: string;
  confidence: string;
  note: string;
}

export interface SavedLook {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  resultUrl: string;
  savedAt: string;
}
