import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGetUserHook } from '@/hooks/User.hook'
import LoadingBars from '@/components/LoadingBars'

const Landing = () => {
  const { data, isLoading, isError } = useGetUserHook()

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f5f7fb]">
        <LoadingBars label="Loading ..." />
      </div>
    )
  }

  if (data) {
    return <Navigate to="/home" replace />
  }

  return (
    <main style={{ width: '100%', height: '100vh' }}>
      <iframe
        title="EduSmart Landing"
        src="/edusmart-landing.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </main>
  )
}

export default Landing
