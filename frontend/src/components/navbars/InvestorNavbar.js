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
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white backdrop-blur-sm py-2">
      <div className="flex h-11 items-center justify-between mx-32">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-[10px]">
                C
              </div>
            </div>
            <span className="font-bold text-sm text-neutral-900">Catalyst</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/dashboard/investor">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-emerald-50 px-3 h-8 gap-1.5"
            >
              <div className="w-4 h-4 rounded-md bg-emerald-50 flex items-center justify-center">
                <Home className="h-3 w-3 text-emerald-600" />
              </div>
              Home
            </Button>
          </Link>
          <Link href="/tenants">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 h-8 gap-1.5"
            >
              <Users className="h-3 w-3" />
              Tenants
            </Button>
          </Link>
          <Link href="/home">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 h-8 gap-1.5"
            >
              <Home className="h-3 w-3" />
              Home
            </Button>
          </Link>
        </nav>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 rounded-lg hover:bg-neutral-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-neutral-600" />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500">
                <span className="sr-only">{notificationCount} unread notifications</span>
              </span>
            )}
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-semibold flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
          
          {/* Profile */}
          <div className="flex items-center gap-2">
            {avatar ? (
              <img 
                src={avatar} 
                alt={displayName}
                className="h-7 w-7 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div 
              className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-semibold text-white text-xs"
              style={{ display: avatar ? 'none' : 'flex' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-neutral-900 leading-tight">
                {isLoading ? (
                  <div className="h-3 w-20 bg-neutral-200 animate-pulse rounded"></div>
                ) : (
                  displayName
                )}
              </div>
              <div className="text-[10px] text-neutral-500">
                {isLoading ? (
                  <div className="h-2.5 w-24 bg-neutral-200 animate-pulse rounded mt-0.5"></div>
                ) : (
                  email
                )}
              </div>
            </div>
            <svg className="w-3 h-3 text-neutral-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default InvestorNavbar
