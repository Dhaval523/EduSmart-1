import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users,
  ReceiptText,
  FileBarChart2
} from 'lucide-react'

const DashboardSideBar = () => {
  const location = useLocation()
  const isCoursesActive = location.pathname.startsWith('/admin/courses')

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/courses', label: 'Courses', icon: ShoppingBag, exact: false },
    { to: '/admin/orders', label: 'Orders', icon: ReceiptText, exact: true },
    { to: '/admin/users', label: 'Users', icon: Users, exact: true },
    { to: '/reports', label: 'Reports', icon: FileBarChart2, exact: true }
  ]

  return (
    <aside className='w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 rounded-xl bg-[#6C5DD3] text-white flex items-center justify-center text-sm font-bold'>
            ES
          </div>
          <div>
            <h1 className='text-lg font-extrabold text-[#1F2937] tracking-tight'>EduSmart</h1>
            <p className='text-xs text-[#6B7280] font-medium'>Admin Console</p>
          </div>
        </div>
      </div>

      <nav className='p-4 space-y-1 overflow-y-auto h-[calc(100vh-96px)]'>
        {navItems.map((item, index) => {
          const isActive = item.label === 'Courses' ? isCoursesActive : undefined
          return (
            <NavLink
              key={index}
              to={item.to}
              end={item.exact}
              className={({ isActive: navActive }) => {
                const activeState = isActive !== undefined ? isActive : navActive
                return `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeState 
                  ? 'bg-[#6C5DD3] text-white shadow-sm' 
                  : 'text-[#1F2937] hover:bg-[#F7F7FB] hover:text-[#1F2937]'
                }`
              }}
            >
              <item.icon className='w-5 h-5 flex-shrink-0' />
              <span className='truncate'>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSideBar




