import Link from "next/link";
import { NavItem } from "./types";

interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  return (
    <nav aria-label="Global" className="hidden md:block">
      <ul className="flex items-center gap-6 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-gray-500 transition hover:text-gray-500/75"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
