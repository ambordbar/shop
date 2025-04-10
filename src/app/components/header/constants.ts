import { NavItem, UserMenuItem } from "./types";

export const navigationItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
];

export const userMenuItems: UserMenuItem[] = [
  { label: "My profile", href: "/profile" },
  { label: "Billing summary", href: "/billing" },
  { label: "Team settings", href: "/team" },
];
