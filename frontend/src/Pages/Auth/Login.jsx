import { Spinner } from '@/components/ui/spinner'
import LoadingBars from '@/components/LoadingBars'
import { useGetUserHook, useLoginHook } from '@/hooks/User.hook'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useUserStore } from '@/Store/user.store'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useLoginHook()
  const { data, isLoading } = useGetUserHook()
  const setUser = useUserStore((state) => state.setUser)

  const loginFormHandler = (data) => {
    mutate(data)
  }

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data, setUser])

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
    <div className='page-bg flex items-center justify-center py-12'>
      <div className='w-full max-w-md card'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#0ea5a4] text-white flex items-center justify-center text-2xl font-bold'>
            ?
          </div>
          <h1 className='text-2xl font-bold text-[#0f172a]'>Welcome Back</h1>
          <p className='text-sm text-[#51607b] mt-1'>Login to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(loginFormHandler)} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-[#0f172a] mb-1'>Email address</label>
            <div className='relative'>
              <Mail size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input type='email' placeholder='you@example.com' {...register('email')} className='w-full pl-10 pr-4 py-3' />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-[#0f172a] mb-1'>Password</label>
            <div className='relative'>
              <Lock size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input type='password' placeholder='--------' {...register('password')} className='w-full pl-10 pr-4 py-3' />
            </div>
          </div>

          <button type='submit' disabled={isPending} className='w-full btn-primary flex items-center justify-center'>
            {isPending ? <Spinner /> : 'Login'}
          </button>
        </form>

        <p className='text-sm text-center text-[#51607b] mt-6'>
          Don't have an account?{' '}
          <Link to='/register' className='text-[#0ea5a4] font-medium hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login






