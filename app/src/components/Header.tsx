import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, FlaskConical } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Research Hub', href: '/blog' },
  { label: 'COA Library', href: '/coa' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-white/[0.06] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-[#5EEAD4]" />
            <span className="font-mono text-sm tracking-[0.15em] text-[#E8E8F0]">
              TETRAVA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm transition-colors duration-200 hover:text-[#5EEAD4] ${
                  location.pathname === link.href
                    ? 'text-[#5EEAD4]'
                    : 'text-[#8A8AA0]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]">
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5EEAD4] text-[10px] font-medium text-[#050508]">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="text-[#8A8AA0] transition-colors hover:text-[#E8E8F0] md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050508]/95 backdrop-blur-xl">
          <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-6 top-5 text-[#8A8AA0] hover:text-[#E8E8F0]"
            >
              <X className="h-6 w-6" />
            </button>
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="font-serif text-3xl text-[#E8E8F0] transition-colors hover:text-[#5EEAD4]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex gap-4">
              <Link
                to="/login"
                className="rounded-lg border border-[#5EEAD4] px-6 py-2.5 text-sm text-[#5EEAD4] transition-colors hover:bg-[#5EEAD4] hover:text-[#050508]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm text-[#050508] transition-all hover:brightness-110"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
