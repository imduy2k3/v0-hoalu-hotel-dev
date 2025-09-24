"use client"

import { useState, useEffect } from "react"
import type { User, UserRole } from "./types"

// This will be replaced with actual database data
const DEMO_USER: User = {
  id: "1",
  username: "admin",
  email: "admin@hoalucity.com",
  fullName: "Quản trị viên",
  role: "admin",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("admin_user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Auth parse error:', error)
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password
        }),
      })

      if (response.ok) {
        const userData = await response.json()
        
        const token = "auth_token_" + Date.now()
        localStorage.setItem("admin_token", token)
        localStorage.setItem("admin_user", JSON.stringify(userData))
        setUser(userData)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("admin_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }
}
