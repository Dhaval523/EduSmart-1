import DashboardSideBar from '@/components/DashboardSideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-[#F7F7FB]'>
      <DashboardSideBar />
      <main className='ml-64 min-h-screen'>
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard


