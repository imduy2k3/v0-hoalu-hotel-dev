"use client"

import { SimpleDropdown } from "@/components/admin/simple-dropdown"
import { DebugUser } from "@/components/admin/debug-user"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-gray-900">Test Dropdown</h1>
        <SimpleDropdown />
      </div>
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Test Dropdown Menu</h2>
          <p className="text-gray-600 mb-4">Click vào avatar ở góc phải để test dropdown menu.</p>
          
          <DebugUser />
          
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">Hướng dẫn test:</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Click vào avatar để mở dropdown</li>
              <li>• Click "Chỉnh sửa thông tin" để test chức năng</li>
              <li>• Click "Đăng xuất" để test chức năng logout</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
