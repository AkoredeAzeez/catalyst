'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { canAccess } from '@/lib/rbac'

/**
 * RoleGuard client component
 * @param {{allowed: string[], children: any}} props
 */
export default function RoleGuard({ allowed, children }) {
  const role = useAuthStore((s) => s.role)
  const router = useRouter()

  useEffect(() => {
    if (!canAccess(role, allowed)) router.replace('/sign-in')
  }, [role, router, allowed])

  return <>{children}</>
}
