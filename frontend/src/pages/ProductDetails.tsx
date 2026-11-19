import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Shield, Award, RotateCcw, Ruler } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { productsApi } from '../services/api';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const TRUST_BADGES = [
  { icon: Ruler, label: 'Free Size', sub: 'One size fits all' },
  { icon: Award, label: 'Handwoven', sub: 'By master weavers' },
  { icon: Shield, label: 'Authentic', sub: '100% genuine fabric' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    productsApi.getById(id)
      .then((data: Product) => {
        setProduct(data);
        setSelectedImage(data.image);
      })
      .catch(() => {
        // Fallback to local data
        const local = PRODUCTS.find(p => p.id === id);
        if (local) {
          setProduct(local);
          setSelectedImage(local.image);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const galleryImages = product
    ? (product.gallery && product.gallery.length > 0 ? product.gallery : [product.image])
    : [];

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-20 min-h-screen bg-pearl">
          <div className="container-max py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-3xl" />
                <div className="flex gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
                  ))}
                </div>
              </div>
              {/* Info skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
                <div className="h-6 bg-gray-200 rounded-xl w-1/3" />
                <div className="flex gap-2">
                  <div className="h-7 bg-gray-200 rounded-full w-20" />
                  <div className="h-7 bg-gray-200 rounded-full w-24" />
                  <div className="h-7 bg-gray-200 rounded-full w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="h-14 bg-gray-200 rounded-2xl" />
                <div className="h-10 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (notFound || !product) {
    return (
      <PageTransition>
        <div className="pt-20 min-h-screen bg-pearl flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6"
          >
            <div className="text-8xl mb-6">🪡</div>
            <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Saree Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              The saree you're looking for may have been removed or the link is incorrect.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-20 min-h-screen bg-pearl">
        <div className="container-max py-8 md:py-12">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-saffron-DEFAULT transition-colors font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Collection
            </button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16"
          >
            {/* ── Left: Image Gallery ── */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-[3/4] shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {/* Occasion badge overlay */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-saffron-DEFAULT px-3 py-1.5 rounded-full shadow-sm">
                    {product.occasion}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === img
                          ? 'border-saffron-DEFAULT shadow-md scale-105'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── Right: Product Info ── */}
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              {/* Name & Price */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-3">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-saffron-DEFAULT">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Attribute Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  {product.colour}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  {product.fabric}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {product.occasion}
                </span>
                {product.style && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {product.style}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">About this Saree</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* Free Size Note */}
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <Ruler className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Free Size</p>
                  <p className="text-xs text-amber-600">One size fits all — 5.5 metres of fabric, universally draped</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to={`/virtual-try-on?product=${product.id}`}
                  className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base font-semibold rounded-2xl shadow-lg shadow-saffron-DEFAULT/20 hover:shadow-saffron-DEFAULT/30 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  ✨ Try This Saree Virtually
                </Link>
                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-2xl hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Collection
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-full bg-saffron-DEFAULT/10 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-saffron-DEFAULT" />
                    </div>
                    <p className="text-xs font-semibold text-charcoal">{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
