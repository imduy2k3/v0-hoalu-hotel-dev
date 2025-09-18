"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { RoomType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RoomBookingCardProps {
  room: RoomType
}

export function RoomBookingCard({ room }: RoomBookingCardProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  const handleBookingCheck = () => {
    if (checkIn && checkOut) {
      const params = new URLSearchParams({
        roomType: room.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      })
      window.location.href = `/booking?${params.toString()}`
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Đặt phòng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          <div className="text-3xl font-bold text-hotel-gold">{room.basePrice.toLocaleString("vi-VN")}₫</div>
          <div className="text-gray-500">/ đêm</div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ngày nhận phòng</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ngày trả phòng</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date <= (checkIn || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Booking Button */}
        <Button
          onClick={handleBookingCheck}
          disabled={!checkIn || !checkOut}
          className="w-full bg-hotel-gold hover:bg-hotel-gold/90 text-white"
        >
          Kiểm tra phòng trống
        </Button>

        {/* Direct Booking Link */}
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/booking">Đặt phòng ngay</Link>
        </Button>

        {/* Contact Info */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          <p>Cần hỗ trợ?</p>
          <p className="font-medium text-hotel-gold">+84 229 123 4567</p>
        </div>
      </CardContent>
    </Card>
  )
}
