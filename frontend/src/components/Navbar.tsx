import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/shop' },
    { label: 'Virtual Try-On', path: '/virtual-try-on' },
    { label: 'About', path: '/about' },
  ];

  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gold-DEFAULT/10'
    : 'bg-transparent';
  const textColor = scrolled || !isHome ? 'text-charcoal' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-saffron-DEFAULT" />
            <span className={`font-display text-xl font-bold ${textColor}`}>VastraAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-saffron-DEFAULT ${
                  location.pathname === link.path ? 'text-saffron-DEFAULT' : textColor
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/virtual-try-on" className="btn-primary text-sm py-2 px-5">
              Try Virtual Saree
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 ${textColor}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container-max py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium py-2 ${
                    location.pathname === link.path ? 'text-saffron-DEFAULT' : 'text-charcoal'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/virtual-try-on" className="btn-primary text-sm text-center">
                Try Virtual Saree
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
