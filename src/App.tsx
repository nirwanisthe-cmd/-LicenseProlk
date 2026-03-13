import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ShoppingCart, User, ShieldCheck, Menu, X, ChevronRight, Star, CheckCircle2, Package, BarChart3, Settings, Users, ShoppingBag, LayoutDashboard, LogOut, ArrowRight, CreditCard, Mail, Search, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from './store/useCartStore';
import { cn, formatCurrency } from './lib/utils';

import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminReportsPage from './pages/AdminReportsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import LegalPage from './pages/LegalPage';

import { MatrixClothBackground } from './components/MatrixClothBackground';
import { auth, onAuthStateChanged, signInWithPopup, googleProvider, signOut } from './lib/firebase';
import { productService, statsService } from './lib/db';

import { ThunderEffect } from './components/ThunderEffect';

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = ({ user }: { user: any }) => {
  const { items } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_session');
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-white/80 backdrop-blur-md border-slate-200 py-3" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">License<span className="text-indigo-600">Pro</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Shop</Link>
          <Link to="/faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ShoppingCart size={22} />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <User size={18} />
                Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-600 hover:text-rose-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <User size={18} />
              Login
            </button>
          )}

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (location.pathname.startsWith('/admin')) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'LicenseProlk' && password === 'WelCome./@1') {
      localStorage.setItem('admin_session', 'true');
      setShowAdminLogin(false);
      window.location.href = '/admin';
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LicensePro</span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Authorized marketplace for premium digital software licenses. Instant delivery, 24/7 support, and guaranteed authenticity.
          </p>
          <div className="flex gap-4">
            {/* Social icons would go here */}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Marketplace</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
            <li><Link to="/shop?cat=os" className="hover:text-indigo-400 transition-colors">Operating Systems</Link></li>
            <li><Link to="/shop?cat=dev" className="hover:text-indigo-400 transition-colors">Developer Tools</Link></li>
            <li><Link to="/shop?cat=design" className="hover:text-indigo-400 transition-colors">Design Software</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/faq" className="hover:text-indigo-400 transition-colors">Help Center / FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/refund-policy" className="hover:text-indigo-400 transition-colors">Refund Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Newsletter</h4>
          <p className="text-sm mb-4">Get updates on new software releases and exclusive discounts.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500" />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 LicensePro Marketplace. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="opacity-0 hover:opacity-100 transition-opacity p-1 cursor-default"
            title="Admin Access"
          >
            <Lock size={12} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Admin Login</h3>
                <button onClick={() => setShowAdminLogin(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900" 
                    required
                  />
                </div>
                {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Login
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

// --- Pages ---

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {
    const initialProducts = [
      { id: "windows-11-pro", name: "Windows 11 Pro Retail Key", slug: "windows-11-pro", short_description: "Official Microsoft Windows 11 Pro Retail License Key.", price: 199.99, compare_price: 249.99, stock_quantity: 500, category: "Operating Systems", delivery_type: "Instant Email", image_url: "https://picsum.photos/seed/win11/800/600", sku: "MS-W11-PRO", status: "active" },
      { id: "adobe-cc-1yr", name: "Adobe Creative Cloud 1 Year", slug: "adobe-cc-1yr", short_description: "Full access to all Adobe apps for 12 months.", price: 599.99, compare_price: 699.99, stock_quantity: 50, category: "Design", delivery_type: "Account Activation", image_url: "https://picsum.photos/seed/adobe/800/600", sku: "AD-CC-1YR", status: "active" },
      { id: "jetbrains-all", name: "JetBrains All Products Pack", slug: "jetbrains-all", short_description: "The complete suite of JetBrains IDEs.", price: 249.00, compare_price: 299.00, stock_quantity: 100, category: "Developer Tools", delivery_type: "License Key", image_url: "https://picsum.photos/seed/jetbrains/800/600", sku: "JB-ALL-PP", status: "active" },
      { id: "autocad-2024", name: "AutoCAD 2024 Subscription", slug: "autocad-2024", short_description: "Professional 2D and 3D CAD software.", price: 1690.00, compare_price: 1850.00, stock_quantity: 20, category: "Engineering", delivery_type: "License Key", image_url: "https://picsum.photos/seed/autocad/800/600", sku: "AC-2024-SUB", status: "active" }
    ];

    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        if (data && data.length > 0) {
          setProducts(data.slice(0, 4));
        } else {
          // Use initial products for UI immediately
          setProducts(initialProducts.slice(0, 4));
          
          // Only attempt to seed if user is admin and email is verified
          const isAdmin = user?.email === "nirwanisthe@gmail.com" && user?.emailVerified;
          if (isAdmin) {
            try {
              await productService.seedProducts(initialProducts);
              const seededData = await productService.getAll();
              if (seededData && seededData.length > 0) {
                setProducts(seededData.slice(0, 4));
              }
            } catch (seedError) {
              console.warn("Seeding failed (likely permissions):", seedError);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        // Fallback to initial products if fetch fails
        setProducts(initialProducts.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
        <MatrixClothBackground />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/50 blur-3xl rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
                <CheckCircle2 size={14} /> Authorized Digital Partner
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                Premium Software <br /> <span className="text-indigo-600">Delivered Instantly.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Unlock your full potential with authentic digital licenses for the world's leading software. Trusted by 50,000+ professionals worldwide.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Browse Marketplace <ArrowRight size={20} />
                </Link>
                <Link to="/faq" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  How it Works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          {/* Mock Partner Logos */}
          <div className="text-xl font-bold text-slate-400">MICROSOFT</div>
          <div className="text-xl font-bold text-slate-400">ADOBE</div>
          <div className="text-xl font-bold text-slate-400">AUTODESK</div>
          <div className="text-xl font-bold text-slate-400">JETBRAINS</div>
          <div className="text-xl font-bold text-slate-400">VMWARE</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Licenses</h2>
              <p className="text-slate-600">Our most popular software solutions at unbeatable prices.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Receive your license key and download instructions via email immediately after purchase. No waiting, no shipping fees.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">100% Authentic</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We only sell authorized retail and volume licenses. Every product is guaranteed to activate and receive official updates.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Expert Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Our technical team is available 24/7 to help with installation, activation, or any questions you might have.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product }: { product: any, key?: any }) => {
  const { addItem } = useCartStore();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <Link to={`/product/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      </Link>
      <div className="p-6">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{product.category}</div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.short_description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
            {product.compare_price && (
              <span className="ml-2 text-sm text-slate-400 line-through">{formatCurrency(product.compare_price)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem(product)}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll().then(data => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Software Marketplace</h1>
            <p className="text-slate-600">Browse our full catalog of professional digital licenses.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search software..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-64" />
            </div>
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-12">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Looks like you haven't added any software to your cart yet.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">Instant Digital Delivery</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-slate-50 text-slate-500"><X size={14} /></button>
                        <span className="px-4 py-1 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-slate-50 text-slate-500"><ChevronRight size={14} className="rotate-90" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider">Remove</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                    <div className="text-xs text-slate-400">{formatCurrency(item.price)} each</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-32">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total())}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatCurrency(total())}</span>
                  </div>
                </div>
                <Link to="/checkout" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout <CreditCard size={20} />
                </Link>
                <div className="mt-6 flex items-center justify-center gap-4 opacity-50">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-medium">Secure Checkout Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin Components ---

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const isLocalAdmin = localStorage.getItem('admin_session') === 'true';
  const isAdmin = (user?.email === "nirwanisthe@gmail.com" && user?.emailVerified) || isLocalAdmin;
  
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleAdminLogout = async () => {
    localStorage.removeItem('admin_session');
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 text-white mb-12">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
        </div>

        <nav className="flex-grow space-y-2">
          <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <AdminNavLink to="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
          <AdminNavLink to="/admin/products" icon={<Package size={20} />} label="Products" />
          <AdminNavLink to="/admin/customers" icon={<Users size={20} />} label="Customers" />
          <AdminNavLink to="/admin/reports" icon={<BarChart3 size={20} />} label="Reports" />
          <AdminNavLink to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm text-left"
          >
            <LogOut size={20} />
            Exit Admin
          </button>
        </div>
      </aside>
      <main className="flex-grow ml-64 p-10">
        {children}
      </main>
    </div>
  );
};

const AdminNavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
        isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "hover:bg-slate-800 hover:text-slate-200"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    statsService.getStats().then(data => setStats(data));
  }, []);

  if (!stats) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-slate-200 rounded-3xl" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">Export CSV</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Generate Report</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalSales)} change="+12.5%" icon={<BarChart3 className="text-indigo-600" />} />
        <StatCard title="Total Orders" value={stats.totalOrders} change="+8.2%" icon={<ShoppingBag className="text-emerald-600" />} />
        <StatCard title="Active Customers" value="1,284" change="+3.1%" icon={<Users className="text-amber-600" />} />
        <StatCard title="Conversion Rate" value="3.42%" change="-0.4%" icon={<Star className="text-rose-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
          <div className="h-64 flex items-end gap-4">
            {stats.dailyRevenue.map((day: any) => (
              <div key={day.date} className="flex-grow flex flex-col items-center gap-2">
                <div className="w-full bg-slate-100 rounded-t-lg relative group">
                  <div 
                    className="bg-indigo-500 rounded-t-lg transition-all duration-500" 
                    style={{ height: `${(day.revenue / 3000) * 100}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCurrency(day.revenue)}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{day.date.split('-').slice(1).join('/')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Orders</h3>
          <div className="space-y-6">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id || order.order_number} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{order.customer_name}</div>
                    <div className="text-xs text-slate-500">{order.order_number}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(order.total_amount)}</div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase">Paid</div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="block text-center mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Orders</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: { title: string, value: string | number, change: string, icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={cn("text-xs font-bold px-2 py-1 rounded-full", change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</div>
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    let interval: any;
    const originalTitle = "LicensePro";
    const notificationTitle = "Message Received! 🔔";
    const bellSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive
        bellSound.play().catch(() => {
          // Silent catch for browsers blocking auto-play
        });
        let showNotification = true;
        interval = setInterval(() => {
          document.title = showNotification ? notificationTitle : originalTitle;
          showNotification = !showNotification;
        }, 1000);
      } else {
        // Tab is active
        clearInterval(interval);
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ThunderEffect />
      <div className="font-sans text-slate-900 antialiased">
        <Navbar user={user} />
        <main>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/refund-policy" element={<LegalPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
