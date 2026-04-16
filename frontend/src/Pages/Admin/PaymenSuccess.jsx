import { useCheckoutSuccess } from '@/hooks/payment.hook'
import React, { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'

const PaymenSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate, isSuccess } = useCheckoutSuccess()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      mutate(sessionId)
    }
  }, [searchParams, mutate])

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/YourCourse')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  return (
    <div className='page-bg flex items-center justify-center py-12'>
      <div className='w-full max-w-2xl card text-center'>
        <div className='w-24 h-24 bg-[#f5fbfa] rounded-2xl flex items-center justify-center mx-auto mb-6'>
          <CheckCircle className='w-14 h-14 text-[#0ea5a4]' />
        </div>

        <h1 className='text-3xl font-bold text-[#0f172a] mb-4'>Enrollment Successful!</h1>
        <p className='text-[#51607b] mb-8'>
          You are now enrolled. Your course access is now active.
        </p>

        <div className='space-y-4 mb-10'>
          <div className='bg-[#f5fbfa] border border-gray-200 rounded-2xl p-4'>
            <div className='flex items-center justify-center gap-3 text-[#0ea5a4]'>
              <CheckCircle className='w-5 h-5' />
              <span className='font-semibold'>Course unlocked successfully</span>
            </div>
          </div>
          <div className='bg-white border border-gray-200 rounded-2xl p-4'>
            <div className='flex items-center justify-center gap-3 text-[#0f172a]'>
              <ArrowRight className='w-5 h-5' />
              <span className='font-semibold'>Redirecting to dashboard in 5s...</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/admin'>
            <button className='btn-primary w-full sm:w-auto'>Go to Dashboard</button>
          </Link>
          <Link to='/home'>
            <button className='btn-secondary w-full sm:w-auto flex items-center justify-center gap-2'>
              <Home className='w-4 h-4' />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymenSuccess




