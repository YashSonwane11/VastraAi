import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Share2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Info,
  CheckCircle,
  ExternalLink,
  Download,
  RotateCcw
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Toast from '../components/Toast';
import { tryonApi, productsApi } from '../services/api';
import { useSavedLooks } from '../hooks/useSavedLooks';
import { PRODUCTS } from '../data/products';
import { Product, TryOnJob } from '../types';

export default function TryOnResult() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { savedLooks, saveLook } = useSavedLooks();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'compare' | 'result'>('compare');

  useEffect(() => {
    if (!jobId) return;

    const loadResult = async () => {
      setLoading(true);
      try {
        let currentResultUrl: string | null = null;
        let selectedProdId: string | null = null;

        // 1. Read cached original photo & metadata from local storage
        const localData = localStorage.getItem(`tryon_result_${jobId}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.originalUrl) {
            setOriginalPhoto(parsed.originalUrl);
          }
          if (parsed.productId) selectedProdId = parsed.productId;
          if (parsed.resultUrl) currentResultUrl = parsed.resultUrl;
        }

        // 2. Fetch authoritative job status from backend API
        try {
          const remoteJob = await tryonApi.getStatus(jobId);
          if (remoteJob.resultUrl) {
            currentResultUrl = remoteJob.resultUrl;
          }
          if (remoteJob.productId) {
            selectedProdId = remoteJob.productId;
          }
          setJob(remoteJob);
        } catch (err) {
          console.warn('Backend status fetch:', err);
        }

        // 3. Resolve product
        if (selectedProdId) {
          const prod = PRODUCTS.find(p => p.id === selectedProdId);
          if (prod) setProduct(prod);
        }

        if (currentResultUrl) {
          setJob(prev => ({
            ...(prev || { jobId, status: 'completed' }),
            jobId,
            productId: selectedProdId || PRODUCTS[0].id,
            status: 'completed',
            resultUrl: currentResultUrl!,
            estimatedFit: {
              size: 'Free Size',
              confidence: 'High (95%)',
              note: 'Standard Indian saree length (5.5m) with unstitched blouse piece (0.8m) comfortably adapts to all body measurements.'
            }
          }));
        }
      } catch (err) {
        console.error('Error loading try-on result:', err);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [jobId]);

  // Check if current look is already saved
  useEffect(() => {
    if (jobId && savedLooks.some(l => l.id === jobId || (job && l.productId === job.productId))) {
      setIsSaved(true);
    }
  }, [jobId, savedLooks, job]);

  const handleSaveLook = () => {
    if (!job || !product) return;
    saveLook({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      resultUrl: job.resultUrl || product.image,
    });
    setIsSaved(true);
    setToastMessage('Look saved to your personal collection!');
    setShowToast(true);
  };

  const handleDownload = () => {
    if (!job?.resultUrl) return;
    const downloadUrl = job.resultUrl.startsWith('/uploads/')
      ? `http://127.0.0.1:8000${job.resultUrl}`
      : job.resultUrl;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `VastraAI_${product?.name.replace(/\s+/g, '_') || 'Virtual_Look'}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage('Download initiated!');
    setShowToast(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Virtual Look on VastraAI',
          text: `Check out how this ${product?.name || 'saree'} looks on me!`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or unavailable
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-24 min-h-screen bg-pearl flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-12 h-12 border-4 border-saffron-DEFAULT border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-charcoal">Loading your Virtual Look...</h2>
            <p className="text-gray-500 text-sm mt-1">Preparing high-resolution side-by-side view</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const resultImageUrl = job?.resultUrl || product?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';
  // Use customer uploaded photo, or product image fallback
  const displayOriginalPhoto = originalPhoto || product?.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f91?w=600&q=80';
  const sareeGarmentImage = product?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80';

  return (
    <PageTransition>
      <div className="pt-20 min-h-screen bg-pearl pb-20">
        <Toast
          isOpen={showToast}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />

        {/* Top Bar Navigation */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-max py-4 flex items-center justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-saffron-DEFAULT transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Collection
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT transition-all"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={handleSaveLook}
                disabled={isSaved}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-gold-DEFAULT/10 text-gold-dark hover:bg-gold-DEFAULT hover:text-white border border-gold-DEFAULT/30'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                {isSaved ? 'Saved' : 'Save Look'}
              </button>
            </div>
          </div>
        </div>

        <div className="container-max py-10">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-saffron-DEFAULT/10 text-saffron-DEFAULT text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Try-On Complete
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-charcoal">
              Your Virtual Look
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Here is how the <span className="font-semibold text-charcoal">{product?.name || 'saree'}</span> drapes on your silhouette.
            </p>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Left: Original Photo / Garment Reference */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Original Reference
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                    Input Photo
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 border border-gray-200">
                  <img
                    src={displayOriginalPhoto}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                    Your Photo
                  </div>
                </div>
              </div>

              {/* Right: AI Virtual Try-On Result */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-semibold tracking-wider text-saffron uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-saffron" />
                    Virtual Try-On Look
                  </span>
                  <span className="text-xs bg-saffron/10 text-saffron px-2 py-0.5 rounded-md font-medium">
                    AI Drape
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 border-2 border-saffron/40 shadow-lg shadow-saffron/5">
                  {job?.resultUrl && job.resultUrl !== displayOriginalPhoto ? (
                    <img
                      src={job.resultUrl.startsWith('/uploads/') ? `http://127.0.0.1:8000${job.resultUrl}` : job.resultUrl}
                      alt="AI Virtual Try-On Result"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes(':8000/uploads/')) {
                          target.src = target.src.replace(/http:\/\/[^/]+(:8000)?/, '');
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pearl to-white text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-saffron border-t-transparent animate-spin mb-4" />
                      <div className="font-display font-semibold text-charcoal text-base">
                        Generating AI Virtual Drape
                      </div>
                      <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                        Draping {product?.name || 'the selected saree'} realistically onto your silhouette while preserving your face, hair, and pose...
                      </p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-saffron to-saffron-dark text-white text-xs font-medium px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Draped
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-charcoal/80 backdrop-blur-md text-white text-xs p-3 rounded-xl">
                    <div className="font-semibold text-gold-light">{product?.name}</div>
                    <div className="text-[11px] text-gray-300 mt-0.5">
                      Draped in {product?.fabric || 'Handwoven Silk'} • {product?.colour}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Saree Craftsmanship & Product Reference Section */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Reference Card */}
              <div className="bg-pearl/60 p-4 rounded-2xl border border-gray-100 flex gap-3.5 items-center">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img
                    src={product?.image || sareeGarmentImage}
                    alt={product?.name || 'Selected Saree'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-saffron uppercase font-bold tracking-wider">Garment Reference</div>
                  <div className="font-display text-sm font-bold text-charcoal truncate mt-0.5">
                    {product?.name}
                  </div>
                  <div className="text-xs text-saffron-DEFAULT font-semibold mt-0.5">
                    {product ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price) : '₹12,999'}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 truncate">
                    {product?.colour} • {product?.fabric}
                  </div>
                </div>
              </div>

              {/* Authentic Saree Specs */}
              <div className="bg-pearl/60 p-4 rounded-2xl border border-gray-100">
                <div className="text-xs text-gray-500 uppercase font-semibold">Saree Specifications</div>
                <div className="font-display text-base font-bold text-charcoal mt-1">
                  5.5m + 0.8m Blouse Piece
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">
                  Weave: <span className="text-charcoal font-semibold">{product?.fabric || 'Kanjivaram Silk'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Traditional handloom drape with genuine zari border, designed to adapt naturally to all heights and silhouettes.
                </p>
              </div>

              {/* Ready to Purchase / Details */}
              <div className="bg-pearl/60 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Craftsmanship Details</div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Admire the weaving artistry, pure silk certifications, and matching unstitched blouse details.
                  </p>
                </div>
                {product && (
                  <Link
                    to={`/product/${product.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-charcoal hover:text-saffron-DEFAULT transition-colors pt-3"
                  >
                    View Product Details <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-2.5 bg-amber-50/70 border border-amber-200/60 p-4 rounded-2xl text-xs text-amber-900 leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950">AI Visualization Disclaimer: </span>
                This image is an AI-generated digital preview of how the chosen saree may drape on you. Actual drape, fall, color saturation, and physical fit may subtly vary based on natural lighting and fabric weave tension.
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 shadow-md shadow-saffron-DEFAULT/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Result
              </button>
              <button
                onClick={() => navigate(product ? `/virtual-try-on?product=${product.id}` : '/virtual-try-on')}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Try-On
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gray-300 text-charcoal hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Collection
              </Link>
            </div>
          </div>

          {/* User's Saved Looks History */}
          {savedLooks.length > 0 && (
            <div className="max-w-5xl mx-auto mt-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal">My Virtual Looks</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Sarees you have previously tried on</p>
                </div>
                <span className="text-xs bg-white border px-3 py-1 rounded-full text-gray-600 font-medium">
                  {savedLooks.length} Saved
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {savedLooks.map(look => (
                  <div
                    key={look.id}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-[3/4] mb-3 bg-gray-50">
                      <img
                        src={look.resultUrl}
                        alt={look.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs text-charcoal line-clamp-1">
                        {look.productName}
                      </h4>
                      <div className="mt-2 flex items-center justify-between">
                        <Link
                          to={`/virtual-try-on?product=${look.productId}`}
                          className="text-[11px] font-semibold text-saffron-DEFAULT hover:underline"
                        >
                          Try Again
                        </Link>
                        <span className="text-[10px] text-gray-400">
                          {new Date(look.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
