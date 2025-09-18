"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Bed, Building, Calendar, Users, BarChart3, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Loại phòng", href: "/admin/room-types", icon: Bed },
  { name: "Phòng", href: "/admin/rooms", icon: Building },
  { name: "Đơn đặt phòng", href: "/admin/bookings", icon: Calendar },
  { name: "Khách hàng", href: "/admin/customers", icon: Users },
  { name: "Thống kê", href: "/admin/reports", icon: BarChart3 },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b">
        <Image src="/images/logo.png" alt="Hoa Lư Hotel" width={32} height={32} />
        <span className="ml-2 font-serif text-lg font-semibold">Hoa Lư Admin</span>
      </div>
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href ? "bg-hotel-gold text-white" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
