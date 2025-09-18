"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RoomsFilter() {
  const [priceRange, setPriceRange] = useState([500000, 2500000])
  const [guests, setGuests] = useState("")
  const [bedType, setBedType] = useState("")
  const [breakfast, setBreakfast] = useState(false)
  const [flexibleCancellation, setFlexibleCancellation] = useState(false)

  const handleReset = () => {
    setPriceRange([500000, 2500000])
    setGuests("")
    setBedType("")
    setBreakfast(false)
    setFlexibleCancellation(false)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Khoảng giá (VNĐ/đêm)</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={3000000}
            min={500000}
            step={100000}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0].toLocaleString("vi-VN")}₫</span>
            <span>{priceRange[1].toLocaleString("vi-VN")}₫</span>
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Số khách</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn số khách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 khách</SelectItem>
              <SelectItem value="2">2 khách</SelectItem>
              <SelectItem value="3">3 khách</SelectItem>
              <SelectItem value="4">4 khách</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bed Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Loại giường</Label>
          <Select value={bedType} onValueChange={setBedType}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại giường" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Twin">Giường đôi</SelectItem>
              <SelectItem value="Queen">Giường Queen</SelectItem>
              <SelectItem value="King">Giường King</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Breakfast */}
        <div className="flex items-center space-x-2">
          <Checkbox id="breakfast" checked={breakfast} onCheckedChange={setBreakfast} />
          <Label htmlFor="breakfast" className="text-sm">
            Bao gồm bữa sáng
          </Label>
        </div>

        {/* Flexible Cancellation */}
        <div className="flex items-center space-x-2">
          <Checkbox id="flexible" checked={flexibleCancellation} onCheckedChange={setFlexibleCancellation} />
          <Label htmlFor="flexible" className="text-sm">
            Hoàn hủy linh hoạt
          </Label>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
          Đặt lại bộ lọc
        </Button>
      </CardContent>
    </Card>
  )
}
