import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Percent, Users } from "lucide-react"

const stats = [
  {
    title: "Doanh thu tháng",
    value: "125.500.000₫",
    change: "+12.5%",
    changeType: "increase" as const,
    icon: TrendingUp,
  },
  {
    title: "Đơn đặt mới",
    value: "48",
    change: "+8 đơn",
    changeType: "increase" as const,
    icon: Calendar,
  },
  {
    title: "Tỉ lệ lấp đầy",
    value: "78%",
    change: "+5.2%",
    changeType: "increase" as const,
    icon: Percent,
  },
  {
    title: "Khách hàng mới",
    value: "32",
    change: "+4 khách",
    changeType: "increase" as const,
    icon: Users,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
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
