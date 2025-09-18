"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const revenueData = [
  { month: "T1", revenue: 85000000, occupancy: 65 },
  { month: "T2", revenue: 92000000, occupancy: 72 },
  { month: "T3", revenue: 125000000, occupancy: 78 },
  { month: "T4", revenue: 110000000, occupancy: 68 },
  { month: "T5", revenue: 135000000, occupancy: 82 },
  { month: "T6", revenue: 145000000, occupancy: 85 },
]

const roomTypeData = [
  { name: "Standard", value: 35, color: "#8884d8" },
  { name: "Deluxe", value: 45, color: "#C5A572" },
  { name: "Suite", value: 20, color: "#82ca9d" },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [roomTypeFilter, setRoomTypeFilter] = useState("all")
  const { toast } = useToast()

  const handleExportCSV = () => {
    toast({
      title: "Đã xuất báo cáo",
      description: "File CSV đã được tải xuống thành công",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thống kê doanh thu</h1>
            <p className="text-gray-600">Báo cáo chi tiết về doanh thu và hiệu suất</p>
          </div>
          <Button onClick={handleExportCSV} className="bg-hotel-gold hover:bg-hotel-gold/90">
            <Download className="mr-2 h-4 w-4" />
            Xuất CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Bộ lọc báo cáo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Khoảng thời gian</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 tháng qua</SelectItem>
                    <SelectItem value="3months">3 tháng qua</SelectItem>
                    <SelectItem value="6months">6 tháng qua</SelectItem>
                    <SelectItem value="1year">1 năm qua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Loại phòng</label>
                <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại phòng</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#C5A572" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tỉ lệ lấp đầy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Tỉ lệ lấp đầy"]} />
                  <Bar dataKey="occupancy" fill="#C5A572" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố đặt phòng theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
