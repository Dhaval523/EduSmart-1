import CourseSection from '@/components/CourseSection'
import SearchResult from '@/components/SearchResult'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAllPurchaseCourse, useGetCourseHook } from '@/hooks/course.hook'
import { getCourseProgressApi } from '@/Api/progress.api'
import { getLearningPathsApi } from '@/services/ai.api'
import { useQueries } from '@tanstack/react-query'
import {
  Brain,
  Sparkles,
  PenLine,
  ArrowRight,
  BookOpen,
  Compass,
  Zap,
  BarChart2,
  Clock,
  User
} from 'lucide-react'

const Home = () => {
  const [SearchInput, setSearchInput] = useState('')
  const [ActiveSearch, setActiveSearch] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data: purchaseData, isLoading: isPurchasedLoading } = useGetAllPurchaseCourse()
  const { data: recommendedData, isLoading: isRecommendedLoading } = useGetCourseHook({
    limit: 6,
    sort: 'updated_desc'
  })
  const [roadmapSummary, setRoadmapSummary] = useState(null)
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchInput(query)
      setActiveSearch(query)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setIsRoadmapLoading(true)
      try {
        const res = await getLearningPathsApi()
        if (res?.success && Array.isArray(res.paths)) {
          setRoadmapSummary(res.paths[0] || null)
        } else {
          setRoadmapSummary(null)
        }
      } catch (error) {
        setRoadmapSummary(null)
      } finally {
        setIsRoadmapLoading(false)
      }
    }

    fetchRoadmaps()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(SearchInput)
  }

  const resetFilter = () => {
    setSearchInput('')
    setActiveSearch('')
  }

  const handleGoToAiPath = () => {
    navigate('/ai-learning-path')
  }

  const handleGoToYourCourses = () => {
    navigate('/YourCourse')
  }

  const purchasedCourses = purchaseData?.purchasedCourse || []
  const continueCourses = purchasedCourses.slice(0, 3)
  const progressQueries = useQueries({
    queries: continueCourses.map((course) => ({
      queryKey: ['courseProgress', course?._id],
      queryFn: () => getCourseProgressApi(course?._id),
      enabled: !!course?._id
    }))
  })

  const progressByCourse = useMemo(() => {
    const map = {}
    progressQueries.forEach((query, index) => {
      const courseId = continueCourses[index]?._id
      if (!courseId) return
      map[courseId] = query?.data || null
    })
    return map
  }, [progressQueries, continueCourses])

  const popularSkills = [
    'React',
    'Node.js',
    'Python',
    'SQL',
    'Data Analysis',
    'Machine Learning',
    'UI Design',
    'Excel',
    'Business Analytics'
  ]

  return (
    <div className='page-bg'>
      <section className='bg-white border-b border-gray-200'>
        <div className='page-shell py-12 lg:py-16'>
          <div className='grid gap-8 lg:grid-cols-2'>
            <div>
              <p className='text-xs font-semibold tracking-[0.25em] uppercase text-[#0ea5a4]'>
                EduSmart Learning Hub
              </p>
              <h1 className='mt-3 text-3xl lg:text-4xl font-bold text-[#0f172a]'>
                Your personal learning hub
              </h1>
              <p className='mt-4 max-w-xl desc'>
                Plan your growth, resume your courses, and build skills with AI-powered roadmaps and practice.
              </p>

              <div className='mt-6 flex flex-wrap gap-3'>
                <button type='button' onClick={handleGoToYourCourses} className='btn-primary inline-flex items-center gap-2'>
                  Continue Learning
                  <ArrowRight className='h-4 w-4' />
                </button>
                <button type='button' onClick={handleGoToAiPath} className='btn-secondary inline-flex items-center gap-2'>
                  Generate AI Roadmap
                  <Brain className='h-4 w-4' />
                </button>
              </div>
            </div>

            <div className='grid gap-4'>
              <div className='card'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5fbfa] text-[#0ea5a4]'>
                    <Sparkles className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-[#0f172a]'>AI-guided learning</p>
                    <p className='text-xs text-[#51607b]'>Build a roadmap tailored to your goals.</p>
                  </div>
                </div>
              </div>

              <div className='card'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0ea5a4] text-white'>
                    <PenLine className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-[#0f172a]'>Quiz and practice</p>
                    <p className='text-xs text-[#51607b]'>Test what you learn after every module.</p>
                  </div>
                </div>
              </div>

              <div className='card'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef3c7] text-[#f59e0b]'>
                    <Compass className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-[#0f172a]'>Discover skills</p>
                    <p className='text-xs text-[#51607b]'>Explore curated courses and popular topics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='page-shell py-12'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h2 className='heading text-[#0f172a]'>Continue learning</h2>
            <p className='desc'>Pick up exactly where you left off.</p>
          </div>
          <button type='button' onClick={handleGoToYourCourses} className='btn-secondary inline-flex items-center gap-2'>
            View all
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-6 grid gap-6 lg:grid-cols-3'>
          {isPurchasedLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className='h-44 rounded-2xl border border-gray-200 bg-white animate-pulse' />
            ))
          ) : continueCourses.length ? (
            continueCourses.map((course) => {
              const progress = progressByCourse[course._id]
              const percent = progress?.percent ?? 0
              const completedCount = progress?.completedCount || 0
              const totalModules = progress?.totalModules || course.modules?.length || 0
              const hasStarted = completedCount > 0
              const actionLabel = hasStarted ? 'Continue Learning' : 'Start Learning'
              return (
                <div key={course._id} className='card'>
                  <div className='flex items-start gap-4'>
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/200x150?text=Course'}
                      alt={course.title}
                      className='h-20 w-24 rounded-xl object-cover'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold text-[#0f172a] line-clamp-2'>{course.title}</h3>
                      <p className='mt-1 text-xs text-[#51607b] line-clamp-2'>
                        {course.description || course.overview || 'Continue your journey.'}
                      </p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div className='flex items-center justify-between text-xs text-[#51607b]'>
                      <span>{percent}% complete</span>
                      <span>{completedCount}/{totalModules}</span>
                    </div>
                    <div className='mt-2 h-2 w-full rounded-full bg-gray-100'>
                      <div className='h-2 rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#0f766e]' style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <button type='button' onClick={() => navigate(`/courses/${course._id}/learn`)} className='mt-4 w-full btn-primary inline-flex items-center justify-center gap-2'>
                    {actionLabel}
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              )
            })
          ) : (
            <div className='col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center'>
              <BookOpen className='mx-auto h-10 w-10 text-gray-400' />
              <h3 className='mt-3 text-lg font-semibold text-[#0f172a]'>No courses yet</h3>
              <p className='mt-2 text-sm text-[#51607b]'>
                Start with a roadmap or explore courses to begin your learning journey.
              </p>
              <div className='mt-4 flex flex-wrap justify-center gap-3'>
                <button type='button' onClick={handleGoToAiPath} className='btn-secondary'>
                  Generate AI Roadmap
                </button>
                <button type='button' onClick={() => navigate('#explore')} className='btn-secondary'>
                  Explore courses
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className='bg-white border-y border-gray-200'>
        <div className='page-shell py-12'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <h2 className='heading text-[#0f172a]'>AI learning paths</h2>
              <p className='desc'>Personalized roadmaps built for your career goals.</p>
            </div>
            <button type='button' onClick={handleGoToAiPath} className='btn-primary inline-flex items-center gap-2'>
              Generate roadmap
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>

          <div className='mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]'>
            <div className='card bg-[#f5fbfa]'>
              {isRoadmapLoading ? (
                <div className='h-24 rounded-xl bg-[#e7f5f4] animate-pulse' />
              ) : roadmapSummary ? (
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-[#0ea5a4]'>Latest roadmap</p>
                  <h3 className='mt-2 text-lg font-semibold text-[#0f172a]'>
                    {roadmapSummary.goal || roadmapSummary.title || 'Your roadmap'}
                  </h3>
                  <p className='mt-1 text-sm text-[#51607b]'>
                    Level: {roadmapSummary.skillLevel || roadmapSummary.level || 'Beginner'}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <span className='chip'>
                      {roadmapSummary.phasesProgress?.length || roadmapSummary.generatedPath?.length || 0} phases
                    </span>
                    {roadmapSummary.learningTimePerWeek ? (
                      <span className='chip'>{roadmapSummary.learningTimePerWeek}</span>
                    ) : null}
                  </div>
                  <button type='button' onClick={handleGoToAiPath} className='mt-4 btn-primary inline-flex items-center gap-2'>
                    View roadmap
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className='text-lg font-semibold text-[#0f172a]'>No roadmap yet</h3>
                  <p className='mt-1 text-sm text-[#51607b]'>
                    Generate a roadmap to guide your learning and match the right courses.
                  </p>
                  <button type='button' onClick={handleGoToAiPath} className='mt-4 btn-primary inline-flex items-center gap-2'>
                    Generate AI roadmap
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>

            <div className='card'>
              <p className='text-xs uppercase tracking-[0.2em] text-[#51607b]'>Popular paths</p>
              <div className='mt-4 space-y-3 text-sm text-[#0f172a]'>
                {['Frontend Developer', 'Data Analyst', 'AI Engineer', 'Full Stack Developer'].map((item) => (
                  <div key={item} className='flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2'>
                    <span>{item}</span>
                    <Zap className='h-4 w-4 text-[#0ea5a4]' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='page-shell py-12'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h2 className='heading text-[#0f172a]'>Recommended courses</h2>
            <p className='desc'>Curated picks based on popular skills and learning goals.</p>
          </div>
          <button type='button' onClick={() => navigate('#explore')} className='btn-secondary inline-flex items-center gap-2'>
            Explore more
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {isRecommendedLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className='h-52 rounded-2xl border border-gray-200 bg-white animate-pulse' />
            ))
          ) : (
            (recommendedData?.courses || []).slice(0, 6).map((course) => (
              <div key={course._id} className='card'>
                <img
                  src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course'}
                  alt={course.title}
                  className='h-32 w-full rounded-xl object-cover'
                />
                <div className='mt-4'>
                  <h3 className='font-semibold text-[#0f172a] line-clamp-2'>{course.title}</h3>
                  <p className='mt-1 text-sm text-[#51607b] line-clamp-2'>
                    {course.description || course.overview || 'Learn with structured lessons.'}
                  </p>
                  <div className='mt-3 flex flex-wrap gap-3 text-xs text-[#51607b]'>
                    {course.level ? (
                      <span className='inline-flex items-center gap-1'>
                        <BarChart2 className='h-3.5 w-3.5' />
                        {course.level}
                      </span>
                    ) : null}
                    {course.duration ? (
                      <span className='inline-flex items-center gap-1'>
                        <Clock className='h-3.5 w-3.5' />
                        {course.duration}
                      </span>
                    ) : null}
                    {course.instructor ? (
                      <span className='inline-flex items-center gap-1'>
                        <User className='h-3.5 w-3.5' />
                        {course.instructor}
                      </span>
                    ) : null}
                  </div>
                  <button type='button' onClick={() => navigate(`/courses/${course._id}`)} className='mt-4 w-full btn-secondary inline-flex items-center justify-center gap-2'>
                    View course
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className='bg-white border-y border-gray-200'>
        <div className='page-shell py-12'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <h2 className='heading text-[#0f172a]'>Popular skills</h2>
              <p className='desc'>Jump into a focused learning track.</p>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap gap-3'>
            {popularSkills.map((skill) => (
              <button
                key={skill}
                type='button'
                onClick={() => {
                  setSearchInput(skill)
                  setActiveSearch(skill)
                  navigate('#explore')
                }}
                className='btn-secondary'
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className='page-shell py-12'>
        <div className='card'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-[#51607b]'>Quiz and practice</p>
              <h2 className='mt-2 text-2xl font-bold text-[#0f172a]'>Practice what you learn</h2>
              <p className='mt-2 desc'>
                Quizzes are generated inside your courses. Jump back into learning to practice.
              </p>
            </div>
            <button type='button' onClick={handleGoToYourCourses} className='btn-primary inline-flex items-center gap-2'>
              Start practice
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </section>

      <section id='explore' className='page-shell pb-16'>
        <div className='mb-6'>
          <h2 className='heading text-[#0f172a]'>Explore courses</h2>
          <p className='desc'>Search or browse the full catalog.</p>
        </div>
        <div className='rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm'>
          <SearchResult
            SearchInput={SearchInput}
            setSearchInput={setSearchInput}
            handleSubmit={handleSubmit}
            onReset={resetFilter}
            hasActiveSearch={!!ActiveSearch}
          />
          <CourseSection ActiveSearch={ActiveSearch} />
        </div>
      </section>
    </div>
  )
}

export default Home





