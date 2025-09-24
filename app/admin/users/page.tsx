"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, User, Shield, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import type { User, UserRole } from "@/lib/types"

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "manager" as UserRole,
    password: "",
    isActive: true
  })
  const { toast } = useToast()

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      } else {
        // Fallback to default users
        setUsers(getDefaultUsers())
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers(getDefaultUsers())
    } finally {
      setLoading(false)
    }
  }

  // Default users for demo
  const getDefaultUsers = (): User[] => [
    {
      id: "1",
      username: "admin",
      email: "admin@hoalucity.com",
      fullName: "Quản trị viên",
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    },
    {
      id: "2",
      username: "manager1",
      email: "manager1@hoalucity.com",
      fullName: "Nguyễn Văn A",
      role: "manager",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    },
    {
      id: "3",
      username: "manager2",
      email: "manager2@hoalucity.com",
      fullName: "Trần Thị B",
      role: "manager",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
  ]

  // Check if user has admin role
  useEffect(() => {
    if (!authLoading && user && user.role !== 'admin') {
      toast({
        title: "Không có quyền truy cập",
        description: "Chỉ quản trị viên mới có thể quản lý tài khoản",
        variant: "destructive",
      })
      router.push('/admin')
    }
  }, [user, authLoading, router, toast])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hotel-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return null
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "manager":
        return "Quản lý"
      default:
        return role
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Tạo tài khoản thành công",
          description: `Tài khoản ${formData.username} đã được tạo`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchUsers()
      } else {
        throw new Error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo tài khoản",
        variant: "destructive"
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Cập nhật thành công",
          description: `Tài khoản ${formData.username} đã được cập nhật`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchUsers()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật tài khoản: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Xóa thành công",
          description: "Tài khoản đã được xóa",
        })
        fetchUsers()
      } else {
        throw new Error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa tài khoản",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      fullName: "",
      role: "manager",
      password: "",
      isActive: true
    })
    setEditingUser(null)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: "",
      isActive: user.isActive
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      handleUpdateUser()
    } else {
      handleCreateUser()
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-gray-600">Quản lý tài khoản và phân quyền người dùng</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng tài khoản</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Quản lý</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'manager').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách tài khoản</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm tài khoản..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tài khoản
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="fullName">Họ tên</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                            <SelectItem value="manager">Quản lý</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="password">
                          {editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required={!editingUser}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Tài khoản hoạt động</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingUser ? 'Cập nhật' : 'Tạo'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
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
                      <th className="text-left py-3">Tên đăng nhập</th>
                      <th className="text-left py-3">Họ tên</th>
                      <th className="text-left py-3">Email</th>
                      <th className="text-left py-3">Vai trò</th>
                      <th className="text-left py-3">Trạng thái</th>
                      <th className="text-left py-3">Đăng nhập cuối</th>
                      <th className="text-left py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 font-medium">{user.username}</td>
                        <td className="py-3">{user.fullName}</td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleText(user.role)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {user.isActive ? "Hoạt động" : "Không hoạt động"}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("vi-VN") : "-"}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
