import React, { useMemo, useState, useEffect } from 'react'
import { useUserStore } from '@/Store/user.store'
import { useGetAllPurchaseCourse } from '@/hooks/course.hook'
import { Spinner } from '@/components/ui/spinner'
import { Mail, ShieldCheck, BookOpen, Calendar, User, Camera, Save } from 'lucide-react'
import { useUpdateProfile } from '@/hooks/User.hook'

const Profile = () => {
  const { user, setUser } = useUserStore()
  const { data: purchaseData, isLoading } = useGetAllPurchaseCourse()
  const { mutate, isPending } = useUpdateProfile()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [profileFile, setProfileFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(user?.profilePhoto || '')

  const purchasedCount = purchaseData?.purchasedCourse?.length || 0
  const isAdmin = Boolean(user?.admin)

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return 'N/A'
    const parsed = new Date(user.createdAt)
    if (Number.isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [user?.createdAt])

  useEffect(() => {
    setFullName(user?.fullName || '')
    if (!profileFile) {
      setPreviewUrl(user?.profilePhoto || '')
    }
  }, [user?.fullName, user?.profilePhoto, profileFile])

  useEffect(() => {
    if (!profileFile) return
    const nextUrl = URL.createObjectURL(profileFile)
    setPreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [profileFile])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = new FormData()
    if (fullName?.trim()) {
      payload.append('fullName', fullName.trim())
    }
    if (profileFile) {
      payload.append('profilePhoto', profileFile)
    }
    mutate(payload, {
      onSuccess: (res) => {
        if (res?.user) {
          setUser(res.user)
        }
        setProfileFile(null)
      }
    })
  }

  if (!user) {
    return (
      <div className='page-bg flex items-center justify-center min-h-[70vh]'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='page-bg'>
      <div className='page-shell py-10'>
        <div className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
          <div className='space-y-6'>
            <div className='card overflow-hidden'>
              <div className='relative h-44 bg-gradient-to-r from-[#0ea5a4] via-[#7D6CE6] to-[#0f766e]'>
                <div className='absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]' />
              </div>
              <div className='px-6 pb-6 relative z-10'>
                <div className='-mt-14 flex items-end gap-5 flex-wrap rounded-2xl bg-white/95 px-4 py-4 shadow-sm border border-white/60'>
                  <div className='h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden relative'>
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={user.fullName || 'User'}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='h-full w-full flex items-center justify-center bg-[#f5f7fb] text-[#0ea5a4]'>
                        <User className='h-8 w-8' />
                      </div>
                    )}
                    <label className='absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-[#f5f7fb] transition'>
                      <Camera className='h-4 w-4 text-[#0ea5a4]' />
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                  <div className='pb-2'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[#51607b]'>Profile</p>
                    <h1 className='text-2xl font-bold text-[#0f172a]'>
                      {user.fullName || 'Welcome back'}
                    </h1>
                    <div className='mt-2 flex items-center gap-2 text-sm text-[#51607b]'>
                      <Mail className='h-4 w-4' />
                      <span>{user.email || 'No email added'}</span>
                    </div>
                  </div>
                  <div className='ml-auto'>
                    {isAdmin ? (
                      <span className='inline-flex items-center gap-2 rounded-full bg-[#f5fbfa] px-3 py-1 text-xs font-semibold text-[#0ea5a4]'>
                        <ShieldCheck className='h-4 w-4' />
                        Admin
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-2 rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-semibold text-[#51607b]'>
                        Member
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='card'>
              <h2 className='text-lg font-semibold text-[#0f172a] mb-4'>Edit profile</h2>
              <form onSubmit={handleSubmit} className='grid gap-4'>
                <div>
                  <label className='text-xs font-semibold uppercase tracking-[0.2em] text-[#51607b]'>
                    Full name
                  </label>
                  <input
                    type='text'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0ea5a4]/40'
                    placeholder='Your name'
                  />
                </div>

                <div>
                  <label className='text-xs font-semibold uppercase tracking-[0.2em] text-[#51607b]'>
                    Email (read only)
                  </label>
                  <input
                    type='email'
                    value={user.email || ''}
                    disabled
                    className='mt-2 w-full rounded-xl border border-gray-200 bg-[#f5f7fb] px-4 py-3 text-sm text-[#51607b]'
                  />
                </div>

                <div className='rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-[#51607b]'>
                  Tip: upload a square photo for best results. Max size depends on server limits.
                </div>

                <button
                  type='submit'
                  disabled={isPending}
                  className='btn-primary inline-flex items-center justify-center gap-2'
                >
                  <Save className='h-4 w-4' />
                  {isPending ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='card'>
              <h2 className='text-lg font-semibold text-[#0f172a] mb-4'>Learning summary</h2>
              <div className='grid gap-4'>
                <div className='flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4'>
                  <div className='flex items-center gap-3'>
                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5fbfa] text-[#0ea5a4]'>
                      <BookOpen className='h-5 w-5' />
                    </span>
                    <div>
                      <p className='text-sm font-semibold text-[#0f172a]'>Purchased courses</p>
                      <p className='text-xs text-[#51607b]'>All-time access</p>
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-[#0f172a]'>
                    {isLoading ? '--' : purchasedCount}
                  </div>
                </div>
                <div className='rounded-2xl border border-gray-200 bg-[#f5f7fb] p-4 text-sm text-[#51607b]'>
                  Keep learning every day to grow your skills and track your progress in the dashboard.
                </div>
                <div className='rounded-2xl border border-gray-200 p-4'>
                  <div className='flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#51607b]'>
                    <Calendar className='h-4 w-4' />
                    Joined
                  </div>
                  <p className='mt-2 text-sm font-semibold text-[#0f172a]'>{joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

