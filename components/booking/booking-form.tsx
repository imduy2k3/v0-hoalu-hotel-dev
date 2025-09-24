"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus } from "lucide-react"
import { differenceInDays } from "date-fns"
import { roomTypes as fallbackRoomTypes } from "@/lib/client-data"
import type { RoomType } from "@/lib/types"
import { BookingSummary } from "./booking-summary"
import { cn } from "@/lib/utils"

interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  roomType: string
  roomCount: number
  fullName: string
  email: string
  phone: string
  notes: string
  promoCode: string
}

export function BookingForm() {
  const searchParams = useSearchParams()
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(fallbackRoomTypes)
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    children: 0,
    roomType: "",
    roomCount: 1,
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    promoCode: "",
  })

  // Pre-fill from URL params
  useEffect(() => {
    const roomTypeParam = searchParams.get("roomType")
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")

    if (roomTypeParam) {
      setBookingData((prev) => ({ ...prev, roomType: roomTypeParam }))
    }
    if (checkInParam) {
      setBookingData((prev) => ({ ...prev, checkIn: new Date(checkInParam) }))
    }
    if (checkOutParam) {
      setBookingData((prev) => ({ ...prev, checkOut: new Date(checkOutParam) }))
    }
  }, [searchParams])

  // Fetch room types from API
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoadingRoomTypes(true)
        const response = await fetch('/api/room-types')
        if (response.ok) {
          const data = await response.json()
          setRoomTypes(data)
        } else {
          console.error('Failed to fetch room types from API')
          // Keep fallback data
        }
      } catch (error) {
        console.error('Error fetching room types:', error)
        // Keep fallback data
      } finally {
        setLoadingRoomTypes(false)
      }
    }

    fetchRoomTypes()
  }, [])

  const selectedRoom = roomTypes.find((room) => room.id === bookingData.roomType)
  const nights =
    bookingData.checkIn && bookingData.checkOut ? differenceInDays(bookingData.checkOut, bookingData.checkIn) : 0
  const subtotal = selectedRoom ? nights * selectedRoom.basePrice * bookingData.roomCount : 0
  const tax = subtotal * 0.1 // 10% VAT
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create booking in database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: bookingData.fullName,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          roomTypeId: bookingData.roomType,
          checkIn: bookingData.checkIn?.toISOString(),
          checkOut: bookingData.checkOut?.toISOString(),
          guestsAdult: bookingData.adults,
          guestsChild: bookingData.children,
          roomsCount: bookingData.roomCount,
          nights: nights,
          totalAmount: total,
          specialRequests: bookingData.notes
        })
      })

      if (response.ok) {
        const booking = await response.json()
        // Redirect to confirmation with real booking ID
        window.location.href = `/booking/confirmation?code=${booking.id}`
      } else {
        throw new Error('Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const isStep1Valid = () => {
    return bookingData.checkIn && bookingData.checkOut && bookingData.roomType
  }

  const nextStep = () => {
    if (isStep1Valid()) {
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              currentStep >= 1 ? "bg-hotel-gold text-white" : "bg-gray-200 text-gray-600"
            )}>
              1
            </div>
            <div className={cn(
              "flex-1 h-1",
              currentStep >= 2 ? "bg-hotel-gold" : "bg-gray-200"
            )}></div>
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              currentStep >= 2 ? "bg-hotel-gold text-white" : "bg-gray-200 text-gray-600"
            )}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Thông tin đặt phòng</span>
            <span>Thông tin khách hàng</span>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Step 1: Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Thông tin đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Chọn ngày</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Ngày nhận phòng *</Label>
                      <Input
                        type="date"
                        value={bookingData.checkIn ? bookingData.checkIn.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined
                          updateBookingData("checkIn", date)
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Ngày trả phòng *</Label>
                      <Input
                        type="date"
                        value={bookingData.checkOut ? bookingData.checkOut.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined
                          updateBookingData("checkOut", date)
                        }}
                        min={bookingData.checkIn ? new Date(bookingData.checkIn.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                  {nights > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Tổng cộng: <span className="font-medium">{nights} đêm</span>
                    </p>
                  )}
                </div>

                {/* Guest Selection */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Số lượng khách</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Người lớn</Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("adults", Math.max(1, bookingData.adults - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{bookingData.adults}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("adults", bookingData.adults + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Trẻ em</Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("children", Math.max(0, bookingData.children - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{bookingData.children}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("children", bookingData.children + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Selection */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Chọn phòng</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Loại phòng *</Label>
                      <Select value={bookingData.roomType} onValueChange={(value) => updateBookingData("roomType", value)} disabled={loadingRoomTypes}>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingRoomTypes ? "Đang tải loại phòng..." : "Chọn loại phòng"} />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes
                            .filter((room) => room.isPublished)
                            .map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.name} - {room.basePrice.toLocaleString("vi-VN")}₫/đêm
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Số lượng phòng</Label>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("roomCount", Math.max(1, bookingData.roomCount - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{bookingData.roomCount}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateBookingData("roomCount", bookingData.roomCount + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStep1Valid()}
                    className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-8 py-2"
                  >
                    Tiếp theo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 2: Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Thông tin liên hệ</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                        Họ và tên *
                      </Label>
                      <Input
                        id="fullName"
                        value={bookingData.fullName}
                        onChange={(e) => updateBookingData("fullName", e.target.value)}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.email}
                          onChange={(e) => updateBookingData("email", e.target.value)}
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                          Số điện thoại *
                        </Label>
                        <Input
                          id="phone"
                          value={bookingData.phone}
                          onChange={(e) => updateBookingData("phone", e.target.value)}
                          placeholder="0901234567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                        Ghi chú (tùy chọn)
                      </Label>
                      <Textarea
                        id="notes"
                        value={bookingData.notes}
                        onChange={(e) => updateBookingData("notes", e.target.value)}
                        placeholder="Yêu cầu đặc biệt, thời gian check-in dự kiến..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Thanh toán</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Phương thức thanh toán</Label>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="font-medium">Thanh toán tại khách sạn</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quý khách có thể thanh toán bằng tiền mặt hoặc thẻ tại quầy lễ tân khi check-in
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="promoCode" className="text-sm font-medium mb-2 block">
                        Mã khuyến mãi (tùy chọn)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="promoCode"
                          value={bookingData.promoCode}
                          onChange={(e) => updateBookingData("promoCode", e.target.value)}
                          placeholder="Nhập mã khuyến mãi"
                        />
                        <Button type="button" variant="outline">
                          Áp dụng
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={prevStep}
                    className="px-8 py-2"
                  >
                    Quay lại
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-8 py-2"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <BookingSummary
          bookingData={bookingData}
          selectedRoom={selectedRoom}
          nights={nights}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  )
}
