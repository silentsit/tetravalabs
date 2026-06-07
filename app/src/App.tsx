import { Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { SocialProofToast } from '@/components/SocialProofWidget';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Blog from '@/pages/Blog';
import BlogArticle from '@/pages/BlogArticle';
import About from '@/pages/About';
import FAQ from '@/pages/FAQ';
import Shipping from '@/pages/Shipping';
import Contact from '@/pages/Contact';
import Ruodisclaimer from '@/pages/RUODisclaimer';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import RefundPolicy from '@/pages/RefundPolicy';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AccountDashboard from '@/pages/AccountDashboard';
import OrderHistory from '@/pages/OrderHistory';
import Categories from '@/pages/Categories';
import CoaLibrary from '@/pages/CoaLibrary';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#050508] text-[#E8E8F0]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ruo-disclaimer" element={<Ruodisclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<AccountDashboard />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/coa" element={<CoaLibrary />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <SocialProofToast />
      </div>
    </CartProvider>
  );
}
