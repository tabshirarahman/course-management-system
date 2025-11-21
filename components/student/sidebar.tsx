"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard/student", label: "Dashboard" },
  { href: "/dashboard/student/browse", label: "Browse Courses" },
  { href: "/dashboard/student/enrolled", label: "My Courses" },
]

export function StudentSidebar() {
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
