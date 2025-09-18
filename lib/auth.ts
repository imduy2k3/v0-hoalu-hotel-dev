"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  role: "Owner" | "Staff"
  fullName: string
}

const DEMO_USER: User = {
  id: "1",
  email: "owner@hoalu.vn",
  role: "Owner",
  fullName: "Nguyễn Văn Admin",
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
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - only accept owner@hoalu.vn / 123456
    if (email === "owner@hoalu.vn" && password === "123456") {
      const token = "demo_token_" + Date.now()
      localStorage.setItem("admin_token", token)
      localStorage.setItem("admin_user", JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
