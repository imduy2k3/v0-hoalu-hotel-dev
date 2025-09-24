"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(usernameOrEmail, password)

    if (success) {
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
      })
      router.push("/admin")
    } else {
      toast({
        title: "Đăng nhập thất bại",
        description: "Tên đăng nhập/Email hoặc mật khẩu không chính xác",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-hotel-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="Hoa Lư Hotel" width={60} height={60} />
          </div>
          <CardTitle className="font-serif text-2xl">Hoa Lư Admin</CardTitle>
          <p className="text-gray-600">Đăng nhập vào hệ thống quản trị</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="usernameOrEmail">Tên đăng nhập hoặc Email</Label>
              <Input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="admin hoặc admin@hoalucity.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-hotel-gold hover:bg-hotel-gold/90" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-2">Tài khoản demo:</p>
            <div className="space-y-1">
              <p className="text-blue-700"><strong>Admin:</strong> admin hoặc admin@hoalucity.com / admin123</p>
              <p className="text-blue-700"><strong>Manager 1:</strong> manager1 hoặc manager1@hoalucity.com / manager123</p>
              <p className="text-blue-700"><strong>Manager 2:</strong> manager2 hoặc manager2@hoalucity.com / manager123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
