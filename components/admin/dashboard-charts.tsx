"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const revenueData = [
  { date: "01/03", revenue: 8500000 },
  { date: "02/03", revenue: 9200000 },
  { date: "03/03", revenue: 7800000 },
  { date: "04/03", revenue: 10500000 },
  { date: "05/03", revenue: 11200000 },
  { date: "06/03", revenue: 9800000 },
  { date: "07/03", revenue: 12500000 },
]

const roomTypeData = [
  { type: "Standard", bookings: 15 },
  { type: "Deluxe", bookings: 22 },
  { type: "Suite", bookings: 11 },
]

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu 7 ngày qua</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#C5A572" strokeWidth={2} dot={{ fill: "#C5A572" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đặt phòng theo loại</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value} đơn`, "Số đặt phòng"]} />
              <Bar dataKey="bookings" fill="#C5A572" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
