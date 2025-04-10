import { z } from "zod";

export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const UserMenuItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type NavItem = z.infer<typeof NavItemSchema>;
export type UserMenuItem = z.infer<typeof UserMenuItemSchema>;
