"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard/admin", label: "Dashboard" },
  { href: "/dashboard/admin/courses", label: "Courses" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/materials", label: "Materials" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "block px-4 py-2 rounded-lg transition-colors",
            pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
