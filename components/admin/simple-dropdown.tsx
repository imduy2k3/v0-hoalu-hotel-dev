"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"

export function SimpleDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex items-center justify-end p-4">
      <div className="relative" ref={dropdownRef}>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-8 h-8 bg-hotel-gold rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm text-left">
            <div className="font-medium leading-tight">Xin chào, Test User!</div>
            <div className="text-xs text-gray-500 leading-tight">Quản trị viên</div>
          </div>
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">testuser</p>
              <p className="text-xs text-gray-500">test@example.com</p>
              <p className="text-xs text-hotel-gold">Quản trị viên</p>
            </div>
            <div className="border-t border-gray-200"></div>
            <button 
              className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => {
                alert('Edit clicked')
                setIsOpen(false)
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Chỉnh sửa thông tin
            </button>
            <div className="border-t border-gray-200"></div>
            <button 
              className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
              onClick={() => {
                alert('Logout clicked')
                setIsOpen(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
