import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3,
  Users,
  ReceiptText
} from 'lucide-react'

const DashboardSideBar = () => {
  const location = useLocation()
  const isCoursesActive = location.pathname.startsWith('/admin/courses')

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/courses', label: 'Courses', icon: ShoppingBag, exact: false },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, exact: true },
    { to: '/admin/orders', label: 'Orders', icon: ReceiptText, exact: true },
    { to: '/admin/users', label: 'Users', icon: Users, exact: true }
  ]

  return (
    <aside className='w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-40'>
      <div className='p-6 border-b border-slate-200'>
        <h1 className='text-2xl font-black text-slate-900 tracking-tight'>EduSmart</h1>
        <p className='text-xs text-slate-500 font-medium mt-1'>Admin Console</p>
      </div>

      <nav className='p-4 space-y-1'>
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
                  ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700' 
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
