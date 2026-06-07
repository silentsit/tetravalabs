import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[#8A8AA0]">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#5A5A70]" />}
          {item.href ? (
            <Link to={item.href} className="transition-colors hover:text-[#5EEAD4]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#5A5A70]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
