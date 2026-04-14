import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const Cancel = () => {
  return (
    <div className='page-bg flex items-center justify-center py-12'>
      <div className='w-full max-w-md card text-center'>
        <div className='w-20 h-20 bg-[#fde68a] rounded-2xl flex items-center justify-center mx-auto mb-6'>
          <ArrowLeft className='w-10 h-10 text-[#f59e0b]' />
        </div>
        <h1 className='text-2xl font-bold text-[#0f172a] mb-3'>Page Not Found</h1>
        <p className='text-[#51607b] mb-8'>
          The page you're looking for doesn't exist or requires special access.
        </p>
        <div className='space-y-3'>
          <Link to='/admin'>
            <button className='w-full btn-primary'>Go to Dashboard</button>
          </Link>
          <Link to='/home'>
            <button className='w-full btn-secondary flex items-center justify-center gap-2'>
              <Home className='w-4 h-4' />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cancel




