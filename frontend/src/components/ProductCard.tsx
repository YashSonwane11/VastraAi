import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card-premium group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-charcoal text-xs font-medium px-2.5 py-1 rounded-full">
          {product.occasion}
        </span>
        {product.featured && (
          <span className="absolute top-3 right-3 bg-saffron-DEFAULT text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        {/* Quick try-on overlay button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/virtual-try-on?product=${product.id}`);
            }}
            className="bg-saffron-DEFAULT text-white text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-saffron-dark transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try Virtually
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-sm font-semibold text-charcoal leading-snug mb-1 hover:text-saffron-DEFAULT transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1 mb-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.fabric}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{product.colour}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-charcoal">{price}</span>
          <Link
            to={`/product/${product.id}`}
            className="text-xs text-saffron-DEFAULT font-medium hover:underline flex items-center gap-1"
          >
            <Eye className="w-3 h-3" /> View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
