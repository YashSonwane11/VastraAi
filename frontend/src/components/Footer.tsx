import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const collectionLinks = [
  { label: 'All Sarees', path: '/shop' },
  { label: 'Banarasi Silk', path: '/shop?fabric=Banarasi+Silk' },
  { label: 'Kanjivaram', path: '/shop?fabric=Kanjivaram' },
  { label: 'Chiffon', path: '/shop?fabric=Chiffon' },
  { label: 'Wedding Collection', path: '/shop?occasion=Wedding' },
];

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Virtual Try-On', path: '/virtual-try-on' },
  { label: 'How It Works', path: '/about#how-it-works' },
  { label: 'Contact', path: '/about#contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Cookie Policy', path: '/cookies' },
  { label: 'Refund Policy', path: '/refunds' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Decorative top border — subtle Indian-inspired repeating pattern */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-DEFAULT via-gold-DEFAULT to-saffron-DEFAULT opacity-80" />

      <div className="container-max py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-saffron-DEFAULT" />
              <span className="font-display text-xl font-bold text-white">VastraAI</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tradition, Reimagined with AI.
            </p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Experience the finest Indian sarees through the lens of modern artificial intelligence. Try on your dream saree — virtually, instantly.
            </p>
          </div>

          {/* Collection links */}
          <div>
            <h4 className="text-sm font-semibold text-gold-DEFAULT uppercase tracking-widest mb-5">
              Collection
            </h4>
            <ul className="space-y-3">
              {collectionLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-saffron-DEFAULT transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-gold-DEFAULT uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-saffron-DEFAULT transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-gold-DEFAULT uppercase tracking-widest mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-saffron-DEFAULT transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 VastraAI. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <span className="text-saffron-DEFAULT">♥</span> for the love of Indian heritage
          </span>
        </div>
      </div>
    </footer>
  );
}
