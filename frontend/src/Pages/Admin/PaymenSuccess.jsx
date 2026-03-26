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
        <div className='w-24 h-24 bg-[#F7F5FF] rounded-2xl flex items-center justify-center mx-auto mb-6'>
          <CheckCircle className='w-14 h-14 text-[#6C5DD3]' />
        </div>

        <h1 className='text-3xl font-bold text-[#1F2937] mb-4'>Payment Successful!</h1>
        <p className='text-[#6B7280] mb-8'>
          Thank you for your purchase. Your course access is now active.
        </p>

        <div className='space-y-4 mb-10'>
          <div className='bg-[#F7F5FF] border border-gray-200 rounded-2xl p-4'>
            <div className='flex items-center justify-center gap-3 text-[#6C5DD3]'>
              <CheckCircle className='w-5 h-5' />
              <span className='font-semibold'>Course unlocked successfully</span>
            </div>
          </div>
          <div className='bg-white border border-gray-200 rounded-2xl p-4'>
            <div className='flex items-center justify-center gap-3 text-[#1F2937]'>
              <ArrowRight className='w-5 h-5' />
              <span className='font-semibold'>Redirecting to dashboard in 5s...</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/admin'>
            <button className='btn-primary w-full sm:w-auto'>Go to Dashboard</button>
          </Link>
          <Link to='/'>
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



