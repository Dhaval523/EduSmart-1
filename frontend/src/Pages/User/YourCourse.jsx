import { useGetAllPurchaseCourse } from '@/hooks/course.hook'
import { getCourseProgressApi } from '@/Api/progress.api'
import { BookOpen, Clock, Play, ChevronRight, BarChart2, Tag } from 'lucide-react'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'

const YourCourse = () => {
  const { data, isLoading } = useGetAllPurchaseCourse()
  const navigate = useNavigate()
  const purchasedCourses = data?.purchasedCourse || []

  const progressQueries = useQueries({
    queries: purchasedCourses.map((course) => ({
      queryKey: ['courseProgress', course?._id],
      queryFn: () => getCourseProgressApi(course?._id),
      enabled: !!course?._id
    }))
  })

  const progressByCourse = useMemo(() => {
    const map = {}
    progressQueries.forEach((query, index) => {
      const courseId = purchasedCourses[index]?._id
      if (!courseId) return
      map[courseId] = query?.data || null
    })
    return map
  }, [progressQueries, purchasedCourses])
  const navigateSinglePurchaseCourse = (id) => {
    navigate(`/courses/${id}/learn`)
  }

  if (isLoading) {
    return (
      <div className='page-bg py-8'>
        <div className='page-shell'>
          <div className='h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-8'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='card'>
                <div className='h-48 bg-gray-200 animate-pulse rounded-xl'></div>
                <div className='mt-4 space-y-3'>
                  <div className='h-6 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-4 bg-gray-100 rounded animate-pulse'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className='page-bg py-8'>
      <div className='page-shell'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-[#1F2937] tracking-tight mb-2'>Your Courses</h1>
          <p className='desc'>Continue learning from where you left off</p>
        </div>

        {!purchasedCourses.length ? (
          <div className='card text-center'>
            <BookOpen className='w-20 h-20 text-gray-300 mx-auto mb-6' />
            <h2 className='text-2xl font-bold text-[#1F2937] mb-3'>No courses yet</h2>
            <p className='text-[#6B7280] mb-8 max-w-md mx-auto'>
              Start learning today by exploring our course catalog
            </p>
            <button onClick={() => navigate('/')} className='btn-primary px-8 py-4'>
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <div className='mb-6 flex items-center justify-between'>
              <p className='text-sm font-semibold text-[#6B7280]'>
                {purchasedCourses.length} {purchasedCourses.length === 1 ? 'Course' : 'Courses'}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {purchasedCourses.map((item, index) => {
                const progress = progressByCourse[item._id]
                const hasStarted = (progress?.completedCount || 0) > 0
                const buttonLabel = hasStarted ? 'Continue Learning' : 'Start Learning'
                return (
                  <div
                  key={item._id || index}
                  onClick={() => navigateSinglePurchaseCourse(item._id)}
                  className='card cursor-pointer group'
                >
                  <div className='relative h-48 bg-gray-100 overflow-hidden rounded-xl'>
                    <img
                      className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
                      src={item.thumbnail || 'https://via.placeholder.com/400x300?text=Course'}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Course'
                      }}
                    />
                    <div className='absolute inset-0 bg-transparent group-hover:bg-[#6C5DD3]/15 transition-all duration-300 flex items-center justify-center'>
                      <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md'>
                          <Play className='w-6 h-6 text-[#6C5DD3] ml-1' fill='currentColor' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <h3 className='font-bold text-lg text-[#1F2937] mb-3 line-clamp-2 leading-snug group-hover:text-[#6C5DD3] transition-colors'>
                      {item.title}
                    </h3>

                    <div className='flex flex-wrap gap-3 text-xs text-[#6B7280] mb-4'>
                      {item.duration && (
                        <div className='flex items-center gap-1'>
                          <Clock className='w-3.5 h-3.5' />
                          <span>{item.duration}</span>
                        </div>
                      )}
                      {item.level && (
                        <div className='flex items-center gap-1'>
                          <BarChart2 className='w-3.5 h-3.5' />
                          <span>{item.level}</span>
                        </div>
                      )}
                      {item.category && (
                        <div className='flex items-center gap-1'>
                          <Tag className='w-3.5 h-3.5' />
                          <span>{item.category}</span>
                        </div>
                      )}
                    </div>
                    <button className='w-full btn-primary flex items-center justify-center gap-2'>
                      {buttonLabel}
                      <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </button>
                  </div>
                </div>
              )})
            }
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default YourCourse





