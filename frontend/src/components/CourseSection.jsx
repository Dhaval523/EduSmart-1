import { useGetCourseHook } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Star, Tag, BarChart2, User } from 'lucide-react'

const CourseSection = ({ ActiveSearch }) => {
  const { data, error, isLoading } = useGetCourseHook(ActiveSearch)
  const navigate = useNavigate()

  console.log(data)
  const navigateSinglecourse = (id) => {
    navigate(`/courses/${id}`)
  }

  if (isLoading) {
    return (
      <div className='py-20 px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='animate-pulse'>
              <div className='bg-slate-200 h-64 rounded-2xl p-6'>
                <div className='bg-slate-300 h-48 rounded-xl mb-4'></div>
                <div className='h-6 bg-slate-300 rounded-full mb-3'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-slate-300 rounded w-3/4'></div>
                  <div className='h-4 bg-slate-300 rounded w-1/2'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='py-20 px-6 bg-slate-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {data?.courses?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigateSinglecourse(item._id)}
              className='group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl 
                        hover:-translate-y-2 hover:border-slate-300 cursor-pointer transition-all 
                        duration-300 overflow-hidden max-w-sm mx-auto'
            >
              {/* Thumbnail */}
              <div className='relative mb-6'>
                <img 
                  src={item.thumbnail || 'https://via.placeholder.com/400x300?text=Course'} 
                  alt={item.title}
                  className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg'>
                  <Star className='w-4 h-4 text-yellow-500 fill-current inline mr-1' />
                  <span className='text-sm font-bold text-slate-800'>{item.rating || '4.8'}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className='font-bold text-xl text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-slate-700'>
                  {item.title}
                </h3>
                <p className='text-sm text-slate-600 mb-4 line-clamp-2'>
                  {item.description || item.overview || 'Learn essential skills in this course.'}
                </p>

                <div className='space-y-2 mb-4'>
                  {item.instructor ? (
                    <div className='flex items-center gap-2 text-xs text-slate-600'>
                      <User className='w-4 h-4' />
                      <span>{item.instructor}</span>
                    </div>
                  ) : null}
                  <div className='flex items-center gap-2 text-xs text-slate-600'>
                    <BarChart2 className='w-4 h-4' />
                    <span>{item.level || 'All levels'}</span>
                  </div>
                  {item.duration ? (
                    <div className='flex items-center gap-2 text-xs text-slate-600'>
                      <Clock className='w-4 h-4' />
                      <span>{item.duration}</span>
                    </div>
                  ) : null}
                  {item.category ? (
                    <div className='flex items-center gap-2 text-xs text-slate-600'>
                      <Tag className='w-4 h-4' />
                      <span>{item.category}</span>
                    </div>
                  ) : null}
                </div>

                {item.tags?.length ? (
                  <div className='flex flex-wrap gap-1 mb-4'>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className='text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className='flex items-center justify-between pt-4 border-t border-slate-200'>
                  <span className='text-sm font-semibold text-slate-900'>₹{item.amount}</span>
                  <button className='px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors group-hover:scale-105'>
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data?.courses?.length === 0 && !isLoading && (
          <div className='text-center py-32'>
            <BookOpen className='w-24 h-24 text-slate-400 mx-auto mb-8' />
            <h2 className='text-2xl font-bold text-slate-900 mb-2'>No courses found</h2>
            <p className='text-slate-600 max-w-md mx-auto text-lg'>
              Try adjusting your search or explore our popular courses below
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseSection
