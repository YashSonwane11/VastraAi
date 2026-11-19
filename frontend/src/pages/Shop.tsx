import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageTransition from '../components/PageTransition';
import { productsApi } from '../services/api';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

const COLOURS = ['Red','Blue','Pink','Green','Wine','Gold','Lavender','Maroon','Peacock Blue','Rose Gold','Ivory','Teal'];
const FABRICS = ['Banarasi Silk','Kanjivaram Silk','Organza','Paithani Silk','Velvet','Pure Silk','Georgette','Chanderi Silk','Tissue Silk','Linen','Patola Silk'];
const OCCASIONS = ['Wedding','Party','Festive','Casual'];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [colour, setColour] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [sort, setSort] = useState('recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string, string | number> = { sort };
    if (search) params.search = search;
    if (colour) params.colour = colour;
    if (fabric) params.fabric = fabric;
    if (occasion) params.occasion = occasion;
    if (minPrice) params.min_price = Number(minPrice);
    if (maxPrice) params.max_price = Number(maxPrice);

    productsApi.getAll(params)
      .then(setProducts)
      .catch(() => {
        // Fallback to local data with client-side filtering
        let results = [...PRODUCTS];
        if (search) {
          const s = search.toLowerCase();
          results = results.filter(p =>
            p.name.toLowerCase().includes(s) ||
            p.colour.toLowerCase().includes(s) ||
            p.fabric.toLowerCase().includes(s)
          );
        }
        if (colour) results = results.filter(p => p.colour.toLowerCase().includes(colour.toLowerCase()));
        if (fabric) results = results.filter(p => p.fabric.toLowerCase().includes(fabric.toLowerCase()));
        if (occasion) results = results.filter(p => p.occasion === occasion);
        if (minPrice) results = results.filter(p => p.price >= Number(minPrice));
        if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
        if (sort === 'price_asc') results.sort((a, b) => a.price - b.price);
        else if (sort === 'price_desc') results.sort((a, b) => b.price - a.price);
        else if (sort === 'newest') results.reverse();
        setProducts(results);
      })
      .finally(() => setLoading(false));
  }, [search, colour, fabric, occasion, sort, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch('');
    setColour('');
    setFabric('');
    setOccasion('');
    setMinPrice('');
    setMaxPrice('');
    setSort('recommended');
  };

  const hasFilters = !!(search || colour || fabric || occasion || minPrice || maxPrice);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sarees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-DEFAULT/30 focus:border-saffron-DEFAULT"
          />
        </div>
      </div>

      {/* Occasion */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Occasion</label>
        <div className="flex flex-wrap gap-2">
          {(['', ...OCCASIONS] as string[]).map(o => (
            <button
              key={o || 'all'}
              onClick={() => setOccasion(o)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                occasion === o
                  ? 'bg-saffron-DEFAULT text-white border-saffron-DEFAULT'
                  : 'border-gray-200 text-gray-600 hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT'
              }`}
            >
              {o || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Colour</label>
        <div className="flex flex-wrap gap-2">
          {(['', ...COLOURS] as string[]).map(c => (
            <button
              key={c || 'all'}
              onClick={() => setColour(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                colour === c
                  ? 'bg-saffron-DEFAULT text-white border-saffron-DEFAULT'
                  : 'border-gray-200 text-gray-600 hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT'
              }`}
            >
              {c || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Fabric</label>
        <div className="flex flex-wrap gap-2">
          {(['', ...FABRICS] as string[]).map(f => (
            <button
              key={f || 'all'}
              onClick={() => setFabric(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                fabric === f
                  ? 'bg-saffron-DEFAULT text-white border-saffron-DEFAULT'
                  : 'border-gray-200 text-gray-600 hover:border-saffron-DEFAULT hover:text-saffron-DEFAULT'
              }`}
            >
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-DEFAULT/30 focus:border-saffron-DEFAULT"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-DEFAULT/30 focus:border-saffron-DEFAULT"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-red-500 hover:text-red-600 font-medium flex items-center justify-center gap-2 py-2 transition-colors"
        >
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="pt-20 min-h-screen bg-pearl">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-max py-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">Saree Collection</h1>
            <p className="text-gray-500 mt-2">Discover exquisite handcrafted sarees from master weavers</p>
          </div>
        </div>

        <div className="container-max py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-charcoal">Filters</h2>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-saffron-DEFAULT font-medium hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-charcoal">{products.length}</span> sarees found
                </p>
                <div className="flex items-center gap-3">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 text-sm font-medium text-charcoal border border-gray-200 px-4 py-2 rounded-xl hover:border-saffron-DEFAULT transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasFilters && (
                      <span className="bg-saffron-DEFAULT text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">!</span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="appearance-none text-sm border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-saffron-DEFAULT/30 bg-white cursor-pointer"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🪴</div>
                  <h3 className="font-display text-xl font-semibold text-charcoal mb-2">No sarees found</h3>
                  <p className="text-gray-500 mb-6">No sarees match your filters. Try adjusting them.</p>
                  <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  <AnimatePresence>
                    {products.map(product => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 p-6 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-charcoal text-lg">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full btn-primary mt-6"
              >
                Apply Filters ({products.length} results)
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
