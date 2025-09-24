"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { customers as fallbackCustomers, bookings as fallbackBookings } from "@/lib/client-data"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Customer, Booking } from "@/lib/types"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers)
  const [bookings, setBookings] = useState<Booking[]>(fallbackBookings)
  const [loading, setLoading] = useState(false)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      const [customersResponse, bookingsResponse] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/bookings')
      ])

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()
        setCustomers(customersData)
      } else {
        setCustomers(fallbackCustomers)
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      } else {
        setBookings(fallbackBookings)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setCustomers(fallbackCustomers)
      setBookings(fallbackBookings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCustomerBookingCount = (customerId: string) => {
    return bookings.filter((booking) => booking.customerId === customerId).length
  }

  const getCustomerTotalSpent = (customerId: string) => {
    const customerBookings = bookings.filter((booking) => booking.customerId === customerId)
    return customerBookings.reduce((total, booking) => total + booking.totalAmount, 0)
  }

  const getCustomerLastBooking = (customerId: string) => {
    const customerBookings = bookings.filter((booking) => booking.customerId === customerId)
    if (customerBookings.length === 0) return null
    
    const sortedBookings = customerBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return sortedBookings[0]
  }

  // Calculate customer statistics
  const getCustomerStats = () => {
    const totalCustomers = customers.length
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((total, booking) => total + booking.totalAmount, 0)
    const averageSpending = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

    return {
      totalCustomers,
      totalBookings,
      totalRevenue,
      averageSpending
    }
  }

  const stats = getCustomerStats()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600">Danh sách khách hàng và lịch sử đặt phòng</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng đơn đặt</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <div className="h-6 w-6 text-yellow-600 font-bold text-center">₫</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString("vi-VN")}₫</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <div className="h-6 w-6 text-purple-600 font-bold text-center">↗</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chi tiêu TB</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageSpending.toLocaleString("vi-VN")}₫</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2">Đang tải dữ liệu...</span>
              </div>
            ) : (
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
                        {(() => {
                          const lastBooking = getCustomerLastBooking(customer.id)
                          return lastBooking ? new Date(lastBooking.createdAt).toLocaleDateString("vi-VN") : "-"
                        })()}
                      </td>
                      <td className="py-3 font-medium text-green-600">
                        {getCustomerTotalSpent(customer.id).toLocaleString("vi-VN")}₫
                      </td>
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
