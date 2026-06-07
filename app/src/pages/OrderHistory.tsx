import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FileCheck, Settings, Package, ChevronRight } from 'lucide-react';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/account', active: false },
  { icon: ShoppingBag, label: 'Orders', href: '/orders', active: true },
  { icon: FileCheck, label: 'Saved COAs', href: '/coas', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

const mockOrders = [
  { id: 'AU-2025-0042', date: '2025-05-28', status: 'Shipped', total: 178.00, items: 3 },
  { id: 'AU-2025-0039', date: '2025-05-15', status: 'Delivered', total: 267.00, items: 5 },
  { id: 'AU-2025-0031', date: '2025-04-30', status: 'Delivered', total: 89.00, items: 1 },
  { id: 'AU-2025-0028', date: '2025-04-12', status: 'Delivered', total: 445.00, items: 7 },
  { id: 'AU-2025-0021', date: '2025-03-28', status: 'Delivered', total: 156.00, items: 2 },
  { id: 'AU-2025-0015', date: '2025-03-10', status: 'Delivered', total: 312.00, items: 4 },
];

export default function OrderHistory() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 lg:px-10">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <h2 className="mb-6 font-medium text-[#E8E8F0]">My Account</h2>
          <nav className="space-y-1">
            {sidebarLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                  link.active
                    ? 'border-l-2 border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]'
                    : 'text-[#8A8AA0] hover:bg-[#0A0A10] hover:text-[#E8E8F0]'
                }`}
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-[#E8E8F0]">Order History</h1>

          {mockOrders.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0A0A10] py-16 text-center">
              <Package className="mb-4 h-10 w-10 text-[#5A5A70]" />
              <p className="text-[#E8E8F0]">No orders yet</p>
              <p className="mt-1 text-sm text-[#8A8AA0]">Your order history will appear here.</p>
              <Link
                to="/shop"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {mockOrders.map(order => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5EEAD4]/10">
                      <Package className="h-5 w-5 text-[#5EEAD4]" />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-[#E8E8F0]">{order.id}</p>
                      <p className="text-xs text-[#8A8AA0]">{order.date} · {order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'Shipped'
                        ? 'bg-[#FBBF24]/10 text-[#FBBF24]'
                        : 'bg-[#34D399]/10 text-[#34D399]'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-medium text-[#E8E8F0]">${order.total.toFixed(2)}</p>
                    <button className="text-[#5A5A70] transition-colors hover:text-[#5EEAD4]">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
