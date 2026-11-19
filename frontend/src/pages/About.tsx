import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Eye,
  Camera,
  CheckCircle,
  Cpu,
  Users,
  Globe,
  Layers,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const journey = [
  {
    icon: Eye,
    step: 'Discover',
    title: 'Explore Our Collection',
    desc: 'Browse hundreds of handpicked sarees — from Banarasi silk to Kanjivaram, from casual cotton to festive georgette. Every piece is carefully sourced from master weavers across India.',
    color: 'from-saffron-DEFAULT/20 to-saffron-DEFAULT/5',
    iconColor: 'text-saffron-DEFAULT',
  },
  {
    icon: Camera,
    step: 'Visualize',
    title: 'Upload Your Photo',
    desc: 'Simply upload a clear photo of yourself. Our system accepts any standard photo from your phone or desktop. No special setup or equipment required.',
    color: 'from-gold-DEFAULT/20 to-gold-DEFAULT/5',
    iconColor: 'text-gold-DEFAULT',
  },
  {
    icon: Sparkles,
    step: 'Try Virtually',
    title: 'AI Drapes It on You',
    desc: "Our AI model analyzes your pose, body shape, and lighting — then digitally drapes the saree on you with stunning realism. See folds, colors, and embroidery exactly as they would appear in real life.",
    color: 'from-saffron/20 to-gold/10',
    iconColor: 'text-saffron',
  },
  {
    icon: CheckCircle,
    step: 'Choose',
    title: 'Pick with Confidence',
    desc: "Compare multiple looks side by side. No more guessing how a saree will look on your skin tone or body type. Buy knowing exactly what you will receive.",
    color: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
];

const techPillars = [
  {
    icon: Cpu,
    title: 'Generative AI',
    desc: 'State-of-the-art diffusion models trained on thousands of garment images to produce photorealistic virtual draping.',
  },
  {
    icon: Layers,
    title: 'Pose & Body Estimation',
    desc: 'Deep learning keypoint detection maps your silhouette precisely, ensuring the saree drapes naturally at every angle.',
  },
  {
    icon: Globe,
    title: 'Color & Texture Fidelity',
    desc: 'Advanced color-matching algorithms preserve intricate embroidery, zari work, and fabric textures in the virtual render.',
  },
  {
    icon: Users,
    title: 'Privacy by Design',
    desc: 'Your photos are processed ephemerally — they never leave our secure pipeline and are deleted immediately after rendering.',
  },
];

export default function About() {
  return (
    <PageTransition>
      {/* ——— HERO ——— */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-charcoal via-[#2d1a0e] to-charcoal">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Background image */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-20 md:opacity-40">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
            alt="Saree craftsmanship"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent" />
        </div>

        <div className="relative container-max w-full pt-28 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold-DEFAULT/20 border border-gold-DEFAULT/30 text-gold-light text-sm font-medium px-4 py-2 rounded-full mb-6"
            >
              <Heart className="w-4 h-4" />
              Our Story
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Tradition,{' '}
              <span className="bg-gradient-to-r from-gold-light via-gold-DEFAULT to-saffron-DEFAULT bg-clip-text text-transparent">
                Reimagined with AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl"
            >
              VastraAI bridges centuries of Indian textile heritage with the power of modern artificial intelligence — so every woman can discover her perfect saree.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ——— MISSION ——— */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80"
                  alt="Traditional Indian saree weaving"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-DEFAULT/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-saffron-DEFAULT" />
                </div>
                <div>
                  <div className="font-display font-bold text-charcoal text-sm">AI-Powered</div>
                  <div className="text-gray-500 text-xs">Virtual Try-On</div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p variants={fadeUp} className="text-saffron-DEFAULT font-medium text-sm tracking-widest uppercase mb-3">
                Our Mission
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-6">
                Making Every Woman Feel Confident in a Saree
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-gray-600 leading-relaxed mb-5">
                Buying a saree online has always felt like a leap of faith. Colors shift on different screens, draping styles vary, and what looks stunning on a model may feel uncertain on your own frame.
              </motion.p>
              <motion.p variants={fadeUp} custom={3} className="text-gray-600 leading-relaxed mb-5">
                VastraAI was born to solve exactly this. We have combined India's richest textile tradition with cutting-edge generative AI so that every woman — regardless of body type, skin tone, or prior saree experience — can see herself draped in any saree before she buys.
              </motion.p>
              <motion.p variants={fadeUp} custom={4} className="text-gray-600 leading-relaxed">
                We believe fashion confidence is a right, not a privilege. Our technology puts that power in your hands, completely free.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ——— JOURNEY ——— */}
      <section className="py-20 bg-pearl">
        <div className="container-max">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-saffron-DEFAULT font-medium text-sm tracking-widest uppercase mb-3">
              The Journey
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-charcoal">
              From Inspiration to Confidence
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 mt-4 max-w-xl mx-auto">
              Four simple steps take you from browsing to buying — with complete confidence in how your saree will look.
            </motion.p>
          </motion.div>

          {/* Step connector line (desktop) */}
          <div className="hidden lg:block relative mb-8">
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-saffron-DEFAULT/30 via-gold-DEFAULT/50 to-saffron-DEFAULT/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {journey.map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Step number pill */}
                <div className="inline-flex items-center gap-1.5 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  <span className="text-gold-DEFAULT">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item.step}</span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>

                <h3 className="font-display font-semibold text-charcoal mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>

                {/* Arrow connector (not on last) */}
                {i < journey.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
                    <ArrowRight className="w-3 h-3 text-saffron-DEFAULT" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— TECHNOLOGY ——— */}
      <section className="py-20 bg-white">
        <div className="container-max">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-saffron-DEFAULT font-medium text-sm tracking-widest uppercase mb-3">
              The Technology
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-charcoal">
              AI Built for Indian Fashion
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Our models are trained specifically on the complexity of saree draping — intricate pleats, pallu arrangements, and regional styles — not generic Western clothing.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-saffron-DEFAULT/30 hover:shadow-sm transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-saffron-DEFAULT/10 rounded-xl flex items-center justify-center group-hover:bg-saffron-DEFAULT/20 transition-colors">
                  <pillar.icon className="w-6 h-6 text-saffron-DEFAULT" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-charcoal mb-1">{pillar.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Large image panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 relative rounded-3xl overflow-hidden"
          >
            <div className="aspect-[21/7] relative">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80"
                alt="Saree collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
              <div className="absolute inset-0 flex items-center px-10 md:px-16">
                <div className="max-w-lg">
                  <p className="text-gold-DEFAULT font-medium text-sm tracking-widest uppercase mb-2">Our Promise</p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                    Every pixel, every thread — rendered with respect for the craft.
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    We work directly with weavers and artisans to digitize their creations faithfully, honoring the centuries of skill that go into every saree.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="py-20 bg-gradient-to-r from-charcoal via-[#2d1a0e] to-charcoal relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-max relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold-DEFAULT font-medium text-sm tracking-widest uppercase mb-4">
              Ready to Try?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Discover Your Perfect Saree Today
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Join thousands of women who have found their ideal saree using VastraAI's virtual try-on. It is free, it is instant, and it is beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/virtual-try-on"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-DEFAULT to-gold-dark text-charcoal px-8 py-4 rounded-full font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-DEFAULT/30 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Try Any Saree Virtually — Free
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all"
              >
                Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
