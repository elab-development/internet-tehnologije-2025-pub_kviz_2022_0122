import { User } from "@/constants/types";

export const menuItems = [
  { href: "/", label: "Početna" },
  { href: "/events", label: "Događaji" },
  { href: "/league", label: "Liga" },
  { href: "/team", label: "Moj tim" },
  { href: "/profile", label: "Profil" },
] satisfies { href: string; label: string }[];

export function getHref(href: string, user: User | null = null) {
  if (href === "/team" && user?.teamId) {
    return "/team/" + user.teamId;
  }

  if (href === "/profile") {
    return "/profile/" + user?.id;
  }

  return href;
}
