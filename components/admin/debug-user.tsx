"use client"

import { useAuth } from "@/lib/auth"

export function DebugUser() {
  const { user, loading, isAuthenticated } = useAuth()

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">🔍 Debug User Data</h3>
      <div className="text-sm text-yellow-700">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? 'Present' : 'Null'}</p>
        {user && (
          <>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          </>
        )}
      </div>
    </div>
  )
}
