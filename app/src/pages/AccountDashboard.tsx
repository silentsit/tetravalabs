import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FileCheck, Settings, Package } from 'lucide-react';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/account', active: true },
  { icon: ShoppingBag, label: 'Orders', href: '/orders', active: false },
  { icon: FileCheck, label: 'Saved COAs', href: '/coas', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

const mockStats = [
  { label: 'Total Orders', value: '12', icon: ShoppingBag },
  { label: 'Active Shipments', value: '2', icon: Package },
  { label: 'Saved COAs', value: '8', icon: FileCheck },
];

const mockOrders = [
  { id: 'AU-2025-0042', date: '2025-05-28', status: 'Shipped', total: 178.00 },
  { id: 'AU-2025-0039', date: '2025-05-15', status: 'Delivered', total: 267.00 },
  { id: 'AU-2025-0031', date: '2025-04-30', status: 'Delivered', total: 89.00 },
  { id: 'AU-2025-0028', date: '2025-04-12', status: 'Delivered', total: 445.00 },
];

export default function AccountDashboard() {
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
          <h1 className="font-serif text-3xl text-[#E8E8F0]">Welcome back, Researcher</h1>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {mockStats.map(stat => (
              <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5">
                <stat.icon className="mb-3 h-5 w-5 text-[#5EEAD4]" />
                <p className="font-serif text-2xl text-[#E8E8F0]">{stat.value}</p>
                <p className="mt-1 text-xs text-[#8A8AA0]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-[#E8E8F0]">Recent Orders</h2>
              <Link to="/orders" className="text-sm text-[#5EEAD4] hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A70]">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A70]">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A70]">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A70]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map(order => (
                    <tr key={order.id} className="border-b border-white/[0.04]">
                      <td className="px-4 py-3 font-mono text-sm text-[#E8E8F0]">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-[#8A8AA0]">{order.date}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Shipped'
                            ? 'bg-[#FBBF24]/10 text-[#FBBF24]'
                            : 'bg-[#34D399]/10 text-[#34D399]'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[#E8E8F0]">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
