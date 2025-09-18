"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { customers, bookings } from "@/lib/client-data"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCustomerBookingCount = (customerId: string) => {
    return bookings.filter((booking) => booking.customerId === customerId).length
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600">Danh sách khách hàng và lịch sử đặt phòng</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách khách hàng</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Tên khách hàng</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Số điện thoại</th>
                    <th className="text-left py-3">Số đơn</th>
                    <th className="text-left py-3">Lần đặt gần nhất</th>
                    <th className="text-left py-3">Tổng chi tiêu</th>
                    <th className="text-left py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b">
                      <td className="py-3 font-medium">{customer.fullName}</td>
                      <td className="py-3">{customer.email}</td>
                      <td className="py-3">{customer.phone}</td>
                      <td className="py-3">{getCustomerBookingCount(customer.id)}</td>
                      <td className="py-3">
                        {customer.lastBookingAt ? new Date(customer.lastBookingAt).toLocaleDateString("vi-VN") : "-"}
                      </td>
                      <td className="py-3 font-medium">{customer.totalSpent?.toLocaleString("vi-VN")}₫</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" title="Xem chi tiết">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
