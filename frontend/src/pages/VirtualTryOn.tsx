import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, AlertCircle, CheckCircle, X, ChevronRight, Image, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { productsApi, tryonApi } from '../services/api';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const STEP_LABELS = ['Select Saree', 'Upload Photo', 'Generate'];

interface PhotoGuideline {
  text: string;
  ok: boolean;
}

const GUIDELINES: PhotoGuideline[] = [
  { text: 'Use a clear, well-lit photo', ok: true },
  { text: 'Face the camera / stand straight', ok: true },
  { text: 'Body should be fully visible', ok: true },
  { text: 'Only one person in the photo', ok: true },
  { text: 'Avoid heavy obstructions or busy backgrounds', ok: true },
];

const PHOTO_RULES = {
  maxSizeMB: 10,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

export default function VirtualTryOn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { id: 'analyze', label: 'Analyzing your photo', status: 'pending' as 'pending' | 'processing' | 'completed' },
    { id: 'detect', label: 'Detecting body position', status: 'pending' as 'pending' | 'processing' | 'completed' },
    { id: 'prepare', label: 'Preparing your saree', status: 'pending' as 'pending' | 'processing' | 'completed' },
    { id: 'create', label: 'Creating virtual look', status: 'pending' as 'pending' | 'processing' | 'completed' },
    { id: 'refine', label: 'Refining the result', status: 'pending' as 'pending' | 'processing' | 'completed' },
  ]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load product from URL param
  useEffect(() => {
    const productId = searchParams.get('product');

    productsApi.getAll()
      .then(products => {
        setAllProducts(products);
        if (productId) {
          const found = products.find(p => p.id === productId);
          if (found) setSelectedProduct(found);
        }
      })
      .catch(() => {
        setAllProducts(PRODUCTS);
        if (productId) {
          const found = PRODUCTS.find(p => p.id === productId);
          if (found) setSelectedProduct(found);
        }
      });
  }, [searchParams]);

  // File validation
  const validateFile = (file: File): string | null => {
    if (!PHOTO_RULES.allowedTypes.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image.';
    }
    if (file.size > PHOTO_RULES.maxSizeMB * 1024 * 1024) {
      return `File is too large. Maximum size is ${PHOTO_RULES.maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    setValidationError(null);
    const err = validateFile(file);
    if (err) { setValidationError(err); return; }
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  // Poll job status
  const pollJobStatus = async (id: string) => {
    const poll = async () => {
      try {
        const job = await tryonApi.getStatus(id);

        if (job.processingSteps) {
          setProcessingSteps(prev => prev.map(ps => {
            const apiStep = job.processingSteps?.find((s: any) => s.id === ps.id);
            return apiStep ? { ...ps, status: apiStep.status as any } : ps;
          }));
        }

        if (job.status === 'completed') {
          // If backend provided resultUrl, update localStorage with the processed URL
          const existing = localStorage.getItem(`tryon_result_${id}`);
          const parsed = existing ? JSON.parse(existing) : {};
          parsed.resultUrl = job.resultUrl;
          parsed.jobId = id;
          parsed.status = 'completed';
          parsed.productId = selectedProduct?.id || parsed.productId;
          localStorage.setItem(`tryon_result_${id}`, JSON.stringify(parsed));
          setTimeout(() => navigate(`/try-on/result/${id}`), 500);
        } else if (job.status === 'failed') {
          setError(job.errorMessage || 'AI generation failed. Please try again.');
          setIsProcessing(false);
        } else {
          setTimeout(poll, 1500);
        }
      } catch (err) {
        console.warn('Polling status error:', err);
        setTimeout(poll, 2500);
      }
    };
    poll();
  };

  // Start generation
  const handleGenerate = async () => {
    if (!selectedProduct || !uploadedFile) return;
    setIsProcessing(true);
    setStep(3);
    setError(null);

    // Save uploaded file locally as data URL so it displays as original reference
    const reader = new FileReader();
    reader.onload = () => {
      const base64Photo = reader.result as string;

      tryonApi.start(selectedProduct.id, uploadedFile)
        .then(job => {
          setJobId(job.jobId);
          // Store original photo and product details in localStorage
          const initialRecord = {
            jobId: job.jobId,
            productId: selectedProduct.id,
            resultUrl: null,
            originalUrl: base64Photo,
            productName: selectedProduct.name,
            productImage: selectedProduct.image,
            productPrice: selectedProduct.price,
            status: 'processing',
          };
          localStorage.setItem(`tryon_result_${job.jobId}`, JSON.stringify(initialRecord));
          pollJobStatus(job.jobId);
        })
        .catch((err) => {
          console.error('Failed to start try-on job:', err);
          setError('Backend AI server is not reachable on http://localhost:8000. Please start the backend service.');
          setIsProcessing(false);
        });
    };
    reader.readAsDataURL(uploadedFile);
  };

  const simulateDemoProcessing = (photoDataUrl: string) => {
    const durations = [1000, 1500, 1500, 2000, 1500];
    let idx = 0;

    const processNext = () => {
      if (idx < processingSteps.length) {
        setProcessingSteps(prev => prev.map((s, i) =>
          i === idx ? { ...s, status: 'processing' } :
          i < idx ? { ...s, status: 'completed' } : s
        ));
        setTimeout(() => {
          setProcessingSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'completed' } : s));
          idx++;
          setTimeout(processNext, 300);
        }, durations[idx] || 1000);
      } else {
        // All done — navigate to result with demo data in localStorage
        const demoResult = {
          jobId: `demo-${Date.now()}`,
          productId: selectedProduct!.id,
          resultUrl: photoDataUrl,
          originalUrl: photoDataUrl,
          productName: selectedProduct!.name,
          productImage: selectedProduct!.image,
          productPrice: selectedProduct!.price,
          isDemo: true,
        };
        localStorage.setItem(`tryon_result_${demoResult.jobId}`, JSON.stringify(demoResult));
        setTimeout(() => navigate(`/try-on/result/${demoResult.jobId}`), 500);
      }
    };

    processNext();
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                done ? 'bg-green-500 text-white' :
                active ? 'bg-saffron-DEFAULT text-white shadow-lg shadow-saffron-DEFAULT/30' :
                'bg-gray-200 text-gray-400'
              }`}>
                {done ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${active ? 'text-saffron-DEFAULT' : done ? 'text-green-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-16 md:w-24 h-0.5 mx-2 mt-[-18px] transition-all duration-500 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <PageTransition>
      <div className="pt-20 min-h-screen bg-pearl">
        <div className="container-max py-10">
          <div className="max-w-2xl mx-auto">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-saffron-DEFAULT/10 text-saffron-DEFAULT text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                AI Virtual Try-On
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
                Your Virtual Look
              </h1>
            </div>

            <StepIndicator />

            <AnimatePresence mode="wait">
              {/* ——— STEP 1: Select Saree ——— */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
                >
                  <h2 className="font-display text-xl font-semibold text-charcoal mb-6">Select Your Saree</h2>

                  {selectedProduct ? (
                    <div>
                      <div className="flex gap-4 p-4 border-2 border-saffron-DEFAULT/30 bg-saffron-DEFAULT/5 rounded-2xl mb-6">
                        <img src={selectedProduct.image} alt={selectedProduct.name}
                          className="w-20 h-28 object-cover rounded-xl flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display font-semibold text-charcoal text-sm leading-snug">{selectedProduct.name}</h3>
                              <p className="text-saffron-DEFAULT font-bold mt-1">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProduct.price)}
                              </p>
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selectedProduct.fabric}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selectedProduct.occasion}</span>
                              </div>
                            </div>
                            <span className="flex-shrink-0 bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Selected
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowProductSelector(true)}
                        className="text-sm text-saffron-DEFAULT font-medium hover:underline flex items-center gap-1 mb-6"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Change Saree
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-6">
                      <Image className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No saree selected yet.</p>
                      <button onClick={() => setShowProductSelector(true)} className="btn-primary text-sm">
                        Browse Collection
                      </button>
                    </div>
                  )}

                  {/* Product selector modal */}
                  <AnimatePresence>
                    {showProductSelector && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4"
                        onClick={() => setShowProductSelector(false)}
                      >
                        <motion.div
                          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                          className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="p-5 border-b flex items-center justify-between">
                            <h3 className="font-display font-semibold text-charcoal">Choose a Saree</h3>
                            <button onClick={() => setShowProductSelector(false)}><X className="w-5 h-5 text-gray-400" /></button>
                          </div>
                          <div className="p-5 overflow-y-auto max-h-[60vh] grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allProducts.map(p => (
                              <button
                                key={p.id}
                                onClick={() => { setSelectedProduct(p); setShowProductSelector(false); }}
                                className={`text-left rounded-xl overflow-hidden border-2 transition-all ${
                                  selectedProduct?.id === p.id ? 'border-saffron-DEFAULT' : 'border-transparent hover:border-gray-200'
                                }`}
                              >
                                <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover" />
                                <div className="p-2">
                                  <p className="text-xs font-medium text-charcoal line-clamp-2 leading-snug">{p.name}</p>
                                  <p className="text-xs text-saffron-DEFAULT font-bold mt-0.5">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.price)}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedProduct}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ——— STEP 2: Upload Photo ——— */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-charcoal">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="font-display text-xl font-semibold text-charcoal">Upload Your Photo</h2>
                  </div>

                  <p className="text-gray-500 text-sm mb-6">Upload a clear photo of yourself to see how this saree may look on you.</p>

                  {/* Guidelines */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">Photo Guidelines</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {GUIDELINES.map(g => (
                        <div key={g.text} className="flex items-center gap-2 text-xs text-amber-800">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {g.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload area */}
                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden mb-6">
                      <img src={previewUrl} alt="Uploaded" className="w-full max-h-80 object-contain bg-gray-50" />
                      <button
                        onClick={() => { setUploadedFile(null); setPreviewUrl(null); setValidationError(null); }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full p-1.5 hover:bg-white shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Photo ready
                      </div>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
                        isDragging
                          ? 'border-saffron-DEFAULT bg-saffron-DEFAULT/5 scale-[1.01]'
                          : 'border-gray-200 hover:border-saffron-DEFAULT hover:bg-gray-50'
                      }`}
                    >
                      <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${isDragging ? 'text-saffron-DEFAULT' : 'text-gray-300'}`} />
                      <p className="font-medium text-charcoal mb-1">Drag & drop your photo here</p>
                      <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                      <span className="text-xs text-gray-400">JPG, PNG, WebP — up to 10MB</span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                    capture="user"
                  />

                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm p-4 rounded-xl mb-4"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {validationError}
                    </motion.div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={!uploadedFile}
                    className="w-full bg-gradient-to-r from-saffron-DEFAULT to-saffron-dark text-white py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-saffron-DEFAULT/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <Sparkles className="w-5 h-5" />
                    ✨ Generate Virtual Try-On
                  </button>
                </motion.div>
              )}

              {/* ——— STEP 3: Processing ——— */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-6 md:p-10 shadow-sm text-center"
                >
                  {error ? (
                    <div>
                      <div className="text-5xl mb-4">😞</div>
                      <h2 className="font-display text-xl font-semibold text-charcoal mb-2">Processing Failed</h2>
                      <p className="text-gray-500 text-sm mb-6">{error}</p>
                      <button
                        onClick={() => {
                          setStep(2);
                          setIsProcessing(false);
                          setError(null);
                          setProcessingSteps(ps => ps.map(s => ({ ...s, status: 'pending' as const })));
                        }}
                        className="btn-primary"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Animated icon */}
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-4 border-saffron-DEFAULT/20 border-t-saffron-DEFAULT"
                        />
                        <div className="absolute inset-2 bg-saffron-DEFAULT/10 rounded-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-saffron-DEFAULT" />
                        </div>
                      </div>

                      <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Creating Your Virtual Look</h2>
                      <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                        Our AI is analyzing your photo and draping the saree on you. This takes just a moment.
                      </p>

                      {/* Steps */}
                      <div className="text-left space-y-3 max-w-xs mx-auto">
                        {processingSteps.map((pStep, i) => (
                          <motion.div
                            key={pStep.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                              {pStep.status === 'completed' ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                </motion.div>
                              ) : pStep.status === 'processing' ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-5 h-5 border-2 border-saffron-DEFAULT border-t-transparent rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-200 rounded-full" />
                              )}
                            </div>
                            <span className={`text-sm ${
                              pStep.status === 'completed' ? 'text-green-600 line-through' :
                              pStep.status === 'processing' ? 'text-saffron-DEFAULT font-medium' :
                              'text-gray-400'
                            }`}>
                              {pStep.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <p className="text-xs text-gray-400 mt-8">
                        AI-powered visualization in progress...
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
