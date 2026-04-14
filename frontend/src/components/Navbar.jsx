import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLoggedOut } from '@/hooks/User.hook'
import { Spinner } from './ui/spinner'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/Store/user.store'
import { LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useLoggedOut()
  const { user } = useUserStore()

  const logoutHandler = () => {
    mutate()
  }

  const navItems = [
    ...(user?.admin ? [{
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate('/admin')
    }] : []),
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Your Courses',
      icon: BookOpen,
      onClick: () => navigate('/YourCourse')
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: logoutHandler,
      loading: isPending
    }
  ]

  return (
    <div className='w-full border-b border-gray-200 bg-white'>
      <div className='page-shell flex h-16 items-center justify-between'>
      {/* Logo - Professional Typography */}
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-xl bg-[#0ea5a4] text-white flex items-center justify-center text-sm font-bold'>
            ES
          </div>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] text-[#51607b] font-semibold'>Smart Tutor</p>
            <h1 className='text-lg font-extrabold text-[#0f172a]'>EduSmart</h1>
          </div>
        </div>

      {/* User Menu */}
      <Popover>
        <PopoverTrigger className='flex items-center gap-3 p-2 rounded-xl border border-gray-200 hover:bg-[#f5f7fb] transition-all duration-200 group cursor-pointer'>
          <Avatar className='w-9 h-9 ring-1 ring-gray-200 group-hover:ring-gray-300 transition-all'>
            <AvatarImage 
              src={user?.profilePhoto || "https://github.com/shadcn.png"} 
              className='object-cover'
            />
            <AvatarFallback className='bg-gray-100 text-[#0f172a] font-semibold text-sm'>
              {user?.fullName ? user.fullName.slice(0,2).toUpperCase() : 'CN'}
            </AvatarFallback>
          </Avatar>
          
          <div className='hidden md:block text-left'>
            <p className='font-semibold text-sm text-[#0f172a] leading-tight'>
              {user?.fullName || 'User'}
            </p>
            <p className='text-xs text-[#51607b] font-medium tracking-wide'>
              {user?.email?.split('@')[0] || 'Member'}
            </p>
          </div>

          {/* Chevron indicator */}
          <svg className='w-4 h-4 text-gray-400 ml-1 group-hover:text-[#51607b] transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </PopoverTrigger>

        <PopoverContent className='w-64 p-2 mt-2 border-gray-200 shadow-lg rounded-2xl bg-white'>
          <div className='p-4 border-b border-gray-200'>
            <p className='font-semibold text-[#0f172a] text-sm tracking-tight'>
              {user?.fullName || 'Welcome back'}
            </p>
            <p className='text-xs text-[#51607b] font-medium'>
              Manage your account
            </p>
          </div>

          <div className='py-2 space-y-1'>
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                disabled={item.loading}
                className='group relative w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-xl transition-all duration-200 hover:bg-[#f5f7fb] text-sm font-medium text-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <item.icon className='w-4 h-4 text-[#51607b] group-hover:text-[#0f172a] flex-shrink-0' />
                <span className='truncate'>{item.label}</span>
                
                {item.loading && (
                  <div className='absolute right-4'>
                    <Spinner size='sm' />
                  </div>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      </div>
    </div>
  )
}

export default Navbar







