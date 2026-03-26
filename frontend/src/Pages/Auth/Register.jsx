import { Spinner } from '@/components/ui/spinner'
import { useRegisterHook } from '@/hooks/User.hook'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'

const Register = () => {
  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useRegisterHook()

  const registerFormHandler = (data) => {
    mutate(data)
  }

  return (
    <div className='page-bg flex items-center justify-center py-12'>
      <div className='w-full max-w-md card'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#6C5DD3] text-white flex items-center justify-center text-2xl font-bold'>
            ?
          </div>
          <h1 className='text-2xl font-bold text-[#1F2937]'>Create Account</h1>
          <p className='text-sm text-[#6B7280] mt-1'>Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit(registerFormHandler)} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-[#1F2937] mb-1'>Full Name</label>
            <div className='relative'>
              <User size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input type='text' placeholder='John Doe' {...register('fullName')} className='w-full pl-10 pr-4 py-3' />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-[#1F2937] mb-1'>Email Address</label>
            <div className='relative'>
              <Mail size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input type='email' placeholder='you@example.com' {...register('email')} className='w-full pl-10 pr-4 py-3' />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-[#1F2937] mb-1'>Password</label>
            <div className='relative'>
              <Lock size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input type='password' placeholder='--------' {...register('password')} className='w-full pl-10 pr-4 py-3' />
            </div>
          </div>

          <button type='submit' disabled={isPending} className='w-full btn-primary flex items-center justify-center'>
            {isPending ? <Spinner /> : 'Create Account'}
          </button>
        </form>

        <p className='text-sm text-center text-[#6B7280] mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-[#6C5DD3] font-medium hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register




