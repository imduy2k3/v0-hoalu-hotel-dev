"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth'

interface PermissionGuardProps {
  children: ReactNode
  requiredRole?: 'admin' | 'manager'
  fallback?: ReactNode
}

export function PermissionGuard({ 
  children, 
  requiredRole = 'admin', 
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuth()
  
  // If no user or user role doesn't match required role, show fallback
  if (!user || (requiredRole === 'admin' && user.role !== 'admin')) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
