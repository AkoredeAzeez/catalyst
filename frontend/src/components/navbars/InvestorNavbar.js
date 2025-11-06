'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { Home, Users } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { api } from '@/lib/api'

export function InvestorNavbar() {
  const user = useAuthStore((s) => s.user)
  const [navbarData, setNavbarData] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch navbar data from backend
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        setIsLoading(true)
        // Fetch user profile and notifications
        const [profileResponse, notificationsResponse] = await Promise.allSettled([
          api.get('/api/user/profile'),
          api.get('/api/notifications/unread-count')
        ])

        // Set navbar data if profile fetch was successful
        if (profileResponse.status === 'fulfilled' && profileResponse.value?.data) {
          setNavbarData(profileResponse.value.data)
        }

        // Set notification count if fetch was successful
        if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value?.data) {
          setNotificationCount(notificationsResponse.value.data.count || 0)
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error)
        // Silently fail and use fallback data
      } finally {
        setIsLoading(false)
      }
    }

    fetchNavbarData()
  }, [])

  // Use backend data if available, otherwise fall back to auth store or defaults
  const displayName = navbarData?.name || user?.name || 'Adewuyi Oyin'
  const email = navbarData?.email || user?.email || 'Oyin@gmail.com'
  const avatar = navbarData?.avatar || user?.avatar
  const hasNotifications = notificationCount > 0
  
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
            </div>
            <span className="font-bold text-xl text-neutral-900">Catalyst</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/dashboard/investor">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-emerald-50 px-4 h-9 gap-2"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                <Home className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              Home
            </Button>
          </Link>
          <Link href="/tenants">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-4 h-9 gap-2"
            >
              <Users className="h-4 w-4" />
              Tenants
            </Button>
          </Link>
          <Link href="/home">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-4 h-9 gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </nav>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-lg hover:bg-neutral-50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-neutral-600" />
            {hasNotifications && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500">
                <span className="sr-only">{notificationCount} unread notifications</span>
              </span>
            )}
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] font-semibold flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
          
          {/* Profile */}
          <div className="flex items-center gap-3">
            {avatar ? (
              <img 
                src={avatar} 
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div 
              className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-semibold text-white text-sm"
              style={{ display: avatar ? 'none' : 'flex' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-neutral-900 leading-tight">
                {isLoading ? (
                  <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded"></div>
                ) : (
                  displayName
                )}
              </div>
              <div className="text-xs text-neutral-500">
                {isLoading ? (
                  <div className="h-3 w-32 bg-neutral-200 animate-pulse rounded mt-0.5"></div>
                ) : (
                  email
                )}
              </div>
            </div>
            <svg className="w-4 h-4 text-neutral-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default InvestorNavbar
