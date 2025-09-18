"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Percent, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStatsData {
  monthlyRevenue: number
  newBookings: number
  occupancyRate: number
  newCustomers: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    monthlyRevenue: 0,
    newBookings: 0,
    occupancyRate: 0,
    newCustomers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        // For now, use mock data until we implement the API endpoints
        setStats({
          monthlyRevenue: 125500000,
          newBookings: 48,
          occupancyRate: 78,
          newCustomers: 32
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsData = [
    {
      title: "Doanh thu tháng",
      value: `${stats.monthlyRevenue.toLocaleString('vi-VN')}₫`,
      change: "+12.5%",
      changeType: "increase" as const,
      icon: TrendingUp,
    },
    {
      title: "Đơn đặt mới",
      value: stats.newBookings.toString(),
      change: "+8 đơn",
      changeType: "increase" as const,
      icon: Calendar,
    },
    {
      title: "Tỉ lệ lấp đầy",
      value: `${stats.occupancyRate}%`,
      change: "+5.2%",
      changeType: "increase" as const,
      icon: Percent,
    },
    {
      title: "Khách hàng mới",
      value: stats.newCustomers.toString(),
      change: "+4 khách",
      changeType: "increase" as const,
      icon: Users,
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-hotel-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
              {stat.change} so với tháng trước
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
