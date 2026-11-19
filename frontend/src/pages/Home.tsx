import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Shield, Zap, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageTransition from '../components/PageTransition';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

const steps = [
  { num: '01', title: 'Choose Your Saree', desc: 'Browse our curated collection of traditional Indian sarees from master weavers.', icon: Heart },
  { num: '02', title: 'Upload Your Photo', desc: 'Upload a clear photo of yourself — from your phone or desktop.', icon: Zap },
  { num: '03', title: 'AI Creates Your Look', desc: 'Our AI analyzes your photo and digitally drapes the saree on you.', icon: Sparkles },
  { num: '04', title: 'See Yourself Wearing It', desc: 'View your virtual look and compare with the original. Try as many as you like!', icon: Star },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll({ featured: true })
      .then(data => setFeatured(data.slice(0, 8)))
      .catch(() => setFeatured(PRODUCTS.filter(p => p.featured).slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      {/* ——— HERO ——— */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-charcoal via-[#2d1a0e] to-charcoal">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} 
        />

        {/* Hero image */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-60">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
            alt="Beautiful saree"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-transparent" />
        </div>

        <div className="relative container-max w-full pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold-DEFAULT/20 border border-gold-DEFAULT/30 text-gold-light text-sm font-medium px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Virtual Try-On
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              See Yourself in Every Saree{' '}
              <span className="bg-gradient-to-r from-gold-light via-gold-DEFAULT to-saffron-DEFAULT bg-clip-text text-transparent">
                Before You Buy.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
            >
              Explore timeless Indian sarees and experience them virtually with AI-powered try-on technology.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-charcoal px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-pearl transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/virtual-try-on"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-saffron-DEFAULT to-saffron-dark text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-saffron-DEFAULT/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Try Virtual Saree
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex gap-8 mt-12"
            >
              {[['12+', 'Sarees'], ['AI', 'Try-On'], ['Free', 'Forever']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="font-display text-2xl font-bold text-gold-DEFAULT">{val}</div>
                  <div className="text-gray-400 text-xs mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ——— HOW IT WORKS ——— */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-saffron-DEFAULT font-medium text-sm tracking-widest uppercase mb-3">
              The Process
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-charcoal">
              How VastraAI Works
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="text-center group"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-saffron-DEFAULT/10 rounded-2xl mb-4 group-hover:bg-saffron-DEFAULT/20 transition-colors">
                  <step.icon className="w-7 h-7 text-saffron-DEFAULT" />
                  <span className="absolute -top-2 -right-2 bg-gold-DEFAULT text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-charcoal mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/virtual-try-on" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Start Your Virtual Try-On
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ——— FEATURED SAREES ——— */}
      <section className="py-20 bg-pearl">
        <div className="container-max">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <motion.p variants={fadeUp} className="text-saffron-DEFAULT font-medium text-sm tracking-widest uppercase mb-2">
                Featured Collection
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-charcoal">
                Exquisite Sarees
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/shop" className="text-saffron-DEFAULT font-medium text-sm hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ——— CTA BANNER ——— */}
      <section className="py-20 bg-gradient-to-r from-charcoal via-[#2d1a0e] to-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E\")" }} 
        />
        <div className="container-max relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold-DEFAULT font-medium text-sm tracking-widest uppercase mb-4">Virtual Try-On</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Experience Your Look Before You Wear It
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Upload your photo and see how any saree from our collection looks on you in seconds.
            </p>
            <Link to="/virtual-try-on"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-DEFAULT to-gold-dark text-charcoal px-8 py-4 rounded-full font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-DEFAULT/30 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Try Any Saree Virtually — Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ——— TRUST SECTION ——— */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'Your photos are processed securely and never stored permanently.' },
              { icon: Zap, title: 'Instant Results', desc: 'AI processes your try-on in seconds. No waiting, no delays.' },
              { icon: Star, title: 'Premium Quality', desc: 'Curated collection of authentic handwoven sarees from master craftsmen.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-saffron-DEFAULT/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-saffron-DEFAULT" />
                </div>
                <h3 className="font-display font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
