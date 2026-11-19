import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import VirtualTryOn from './pages/VirtualTryOn';
import TryOnResult from './pages/TryOnResult';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-pearl">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/virtual-try-on" element={<VirtualTryOn />} />
              <Route path="/try-on/result/:jobId" element={<TryOnResult />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
