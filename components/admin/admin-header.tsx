"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { User, LogOut, Menu, Settings } from "lucide-react"

export function AdminHeader() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  // Debug user data
  useEffect(() => {
    console.log('🔍 Admin Header - User data:', user)
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    })
    router.push("/admin/login")
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          email: profileData.email,
          password: profileData.newPassword || undefined
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin cá nhân đã được cập nhật",
        })
        setIsProfileDialogOpen(false)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive"
      })
    }
  }

  const openProfileDialog = () => {
    setProfileData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsProfileDialogOpen(true)
  }

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">Hệ thống quản trị</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 bg-hotel-gold rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-sm text-left">
              <div className="font-medium leading-tight">
                Xin chào, {user?.fullName || 'Quản trị viên'}!
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {user?.role === 'admin' ? 'Quản trị viên' : 'Quản lý'}
              </div>
            </div>
          </Button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.username || 'admin'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@hoalucity.com'}</p>
                <p className="text-xs text-hotel-gold capitalize">
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Quản lý'}
                </p>
              </div>
              <div className="border-t border-gray-200"></div>
              <button 
                className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center"
                onClick={() => {
                  openProfileDialog()
                  setIsDropdownOpen(false)
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin
              </button>
              <div className="border-t border-gray-200"></div>
              <button 
                className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
                onClick={() => {
                  handleLogout()
                  setIsDropdownOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={profileData.currentPassword}
                onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Nhập mật khẩu hiện tại để xác thực"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới (để trống nếu không đổi)</Label>
              <Input
                id="newPassword"
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Mật khẩu mới"
              />
            </div>
            {profileData.newPassword && (
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateProfile}>
                Cập nhật
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
