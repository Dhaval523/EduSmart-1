import { useGetCourseHook } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Star, Tag, BarChart2, User } from 'lucide-react'

const CourseSection = ({ ActiveSearch }) => {
  const { data, isLoading } = useGetCourseHook(ActiveSearch)
  const navigate = useNavigate()

  const navigateSinglecourse = (id) => {
    navigate(`/courses/${id}`)
  }

  if (isLoading) {
    return (
      <div className='py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='card animate-pulse'>
              <div className='bg-gray-200 h-48 rounded-xl mb-4'></div>
              <div className='h-6 bg-gray-200 rounded-full mb-3'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {data?.courses?.map((item) => (
          <div
            key={item._id}
            onClick={() => navigateSinglecourse(item._id)}
            className='card cursor-pointer group'
          >
            <div className='relative mb-4'>
              <img
                src={item.thumbnail || 'https://via.placeholder.com/400x300?text=Course'}
                alt={item.title}
                className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
              />
              <div className='absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200'>
                <Star className='w-4 h-4 text-[#f59e0b] fill-current inline mr-1' />
                <span className='text-sm font-bold text-[#0f172a]'>{item.rating || '4.8'}</span>
              </div>
            </div>

            <div>
              <h3 className='font-bold text-lg text-[#0f172a] leading-tight mb-2 line-clamp-2 group-hover:text-[#0ea5a4]'>
                {item.title}
              </h3>
              <p className='text-sm text-[#51607b] mb-4 line-clamp-2'>
                {item.description || item.overview || 'Learn essential skills in this course.'}
              </p>

              <div className='space-y-2 mb-4'>
                {item.instructor ? (
                  <div className='flex items-center gap-2 text-xs text-[#51607b]'>
                    <User className='w-4 h-4' />
                    <span>{item.instructor}</span>
                  </div>
                ) : null}
                <div className='flex items-center gap-2 text-xs text-[#51607b]'>
                  <BarChart2 className='w-4 h-4' />
                  <span>{item.level || 'All levels'}</span>
                </div>
                {item.duration ? (
                  <div className='flex items-center gap-2 text-xs text-[#51607b]'>
                    <Clock className='w-4 h-4' />
                    <span>{item.duration}</span>
                  </div>
                ) : null}
                {item.category ? (
                  <div className='flex items-center gap-2 text-xs text-[#51607b]'>
                    <Tag className='w-4 h-4' />
                    <span>{item.category}</span>
                  </div>
                ) : null}
              </div>

              {item.tags?.length ? (
                <div className='flex flex-wrap gap-1 mb-4'>
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className='text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-[#51607b]'>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                <span className='text-sm font-semibold text-[#0f172a]'>INR {item.amount}</span>
                <button className='btn-primary text-sm'>View Course</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.courses?.length === 0 && !isLoading && (
        <div className='text-center py-20'>
          <BookOpen className='w-20 h-20 text-gray-400 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-[#0f172a] mb-2'>No courses found</h2>
          <p className='text-[#51607b] max-w-md mx-auto'>
            Try adjusting your search or explore our popular courses below
          </p>
        </div>
      )}
    </div>
  )
}

export default CourseSection





