"use client"

import { useState, useEffect } from "react"
import { RoomsGrid } from "./rooms-grid"
import { RoomType } from "@/lib/types"
import { roomTypes as fallbackRoomTypes } from "@/lib/client-data"

interface RoomsDataProviderProps {
  initialRoomTypes?: RoomType[]
}

export function RoomsDataProvider({ initialRoomTypes }: RoomsDataProviderProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes || fallbackRoomTypes)
  const [loading, setLoading] = useState(false)

  const fetchRoomTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/room-types')
      if (response.ok) {
        const data = await response.json()
        setRoomTypes(data)
      }
    } catch (error) {
      console.error('Error fetching room types:', error)
      // Keep using fallback data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch room types from API on component mount
    fetchRoomTypes()
  }, [])

  return (
    <div>
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Đang tải dữ liệu phòng...</p>
        </div>
      )}
      <RoomsGrid roomTypes={roomTypes} />
    </div>
  )
}
