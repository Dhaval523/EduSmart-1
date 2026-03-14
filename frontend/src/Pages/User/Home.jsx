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
  Target,
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
    <div className='min-h-screen bg-slate-50'>
      {/* Hero / Learning Hub */}
      <section className='border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50'>
        <div className='max-w-6xl mx-auto px-6 py-12 lg:py-16'>
          <div className='grid gap-8 lg:grid-cols-[1.3fr_0.9fr]'>
            <div>
              <p className='text-xs font-semibold tracking-[0.25em] uppercase text-emerald-600'>
                EduSmart Learning Hub
              </p>
              <h1 className='mt-3 text-3xl lg:text-4xl font-black tracking-tight text-slate-900'>
                Your personal learning hub
              </h1>
              <p className='mt-4 max-w-xl text-sm lg:text-base text-slate-600'>
                Plan your growth, resume your courses, and build skills with AI-powered roadmaps and practice.
              </p>

              <div className='mt-6 flex flex-wrap gap-3'>
                <button
                  type='button'
                  onClick={handleGoToYourCourses}
                  className='inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors'
                >
                  Continue Learning
                  <ArrowRight className='h-4 w-4' />
                </button>
                <button
                  type='button'
                  onClick={handleGoToAiPath}
                  className='inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 hover:border-emerald-400 transition-colors'
                >
                  Generate AI Roadmap
                  <Brain className='h-4 w-4' />
                </button>
              </div>
            </div>

            <div className='grid gap-4'>
              <div className='rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600'>
                    <Sparkles className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-slate-900'>AI-guided learning</p>
                    <p className='text-xs text-slate-600'>Build a roadmap tailored to your goals.</p>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-200'>
                    <PenLine className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-slate-900'>Quiz and practice</p>
                    <p className='text-xs text-slate-600'>Test what you learn after every module.</p>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600'>
                    <Compass className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='font-semibold text-slate-900'>Discover skills</p>
                    <p className='text-xs text-slate-600'>Explore curated courses and popular topics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning */}
      <section className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Continue learning</h2>
            <p className='text-sm text-slate-600'>Pick up exactly where you left off.</p>
          </div>
          <button
            type='button'
            onClick={handleGoToYourCourses}
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300'
          >
            View all
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-6 grid gap-6 lg:grid-cols-3'>
          {isPurchasedLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className='h-44 rounded-2xl border border-slate-200 bg-white animate-pulse' />
            ))
          ) : continueCourses.length ? (
            continueCourses.map((course) => {
              const progress = progressByCourse[course._id]
              const percent = progress?.percent ?? 0
              const completedCount = progress?.completedCount || 0
              const totalModules = progress?.totalModules || course.modules?.length || 0
              return (
                <div key={course._id} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                  <div className='flex items-start gap-4'>
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/200x150?text=Course'}
                      alt={course.title}
                      className='h-20 w-24 rounded-xl object-cover'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold text-slate-900 line-clamp-2'>{course.title}</h3>
                      <p className='mt-1 text-xs text-slate-600 line-clamp-2'>
                        {course.description || course.overview || 'Continue your journey.'}
                      </p>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <div className='flex items-center justify-between text-xs text-slate-500'>
                      <span>{percent}% complete</span>
                      <span>{completedCount}/{totalModules}</span>
                    </div>
                    <div className='mt-2 h-2 w-full rounded-full bg-slate-100'>
                      <div className='h-2 rounded-full bg-emerald-500' style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => navigate(`/courses/${course._id}/learn`)}
                    className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'
                  >
                    Continue
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              )
            })
          ) : (
            <div className='col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center'>
              <BookOpen className='mx-auto h-10 w-10 text-slate-400' />
              <h3 className='mt-3 text-lg font-semibold text-slate-900'>No courses yet</h3>
              <p className='mt-2 text-sm text-slate-600'>
                Start with a roadmap or explore courses to begin your learning journey.
              </p>
              <div className='mt-4 flex flex-wrap justify-center gap-3'>
                <button
                  type='button'
                  onClick={handleGoToAiPath}
                  className='rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'
                >
                  Generate AI Roadmap
                </button>
                <button
                  type='button'
                  onClick={() => navigate('#explore')}
                  className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700'
                >
                  Explore courses
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Learning Paths */}
      <section className='bg-white border-y border-slate-200'>
        <div className='max-w-6xl mx-auto px-6 py-12'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900'>AI learning paths</h2>
              <p className='text-sm text-slate-600'>Personalized roadmaps built for your career goals.</p>
            </div>
            <button
              type='button'
              onClick={handleGoToAiPath}
              className='inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600'
            >
              Generate roadmap
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>

          <div className='mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]'>
            <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6'>
              {isRoadmapLoading ? (
                <div className='h-24 rounded-xl bg-emerald-100 animate-pulse' />
              ) : roadmapSummary ? (
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-emerald-700'>Latest roadmap</p>
                  <h3 className='mt-2 text-lg font-semibold text-slate-900'>
                    {roadmapSummary.goal || roadmapSummary.title || 'Your roadmap'}
                  </h3>
                  <p className='mt-1 text-sm text-slate-600'>
                    Level: {roadmapSummary.skillLevel || roadmapSummary.level || 'Beginner'}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <span className='rounded-full bg-white px-3 py-1 text-xs text-slate-700'>
                      {roadmapSummary.phasesProgress?.length || roadmapSummary.generatedPath?.length || 0} phases
                    </span>
                    {roadmapSummary.learningTimePerWeek ? (
                      <span className='rounded-full bg-white px-3 py-1 text-xs text-slate-700'>
                        {roadmapSummary.learningTimePerWeek}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type='button'
                    onClick={handleGoToAiPath}
                    className='mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
                  >
                    View roadmap
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>No roadmap yet</h3>
                  <p className='mt-1 text-sm text-slate-600'>
                    Generate a roadmap to guide your learning and match the right courses.
                  </p>
                  <button
                    type='button'
                    onClick={handleGoToAiPath}
                    className='mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white'
                  >
                    Generate AI roadmap
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Popular paths</p>
              <div className='mt-4 space-y-3 text-sm text-slate-700'>
                {['Frontend Developer', 'Data Analyst', 'AI Engineer', 'Full Stack Developer'].map((item) => (
                  <div key={item} className='flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2'>
                    <span>{item}</span>
                    <Zap className='h-4 w-4 text-emerald-500' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      <section className='max-w-6xl mx-auto px-6 py-12'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Recommended courses</h2>
            <p className='text-sm text-slate-600'>Curated picks based on popular skills and learning goals.</p>
          </div>
          <button
            type='button'
            onClick={() => navigate('#explore')}
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700'
          >
            Explore more
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>

        <div className='mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {isRecommendedLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className='h-52 rounded-2xl border border-slate-200 bg-white animate-pulse' />
            ))
          ) : (
            (recommendedData?.courses || []).slice(0, 6).map((course) => (
              <div key={course._id} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                <img
                  src={course.thumbnail || 'https://via.placeholder.com/400x250?text=Course'}
                  alt={course.title}
                  className='h-32 w-full rounded-xl object-cover'
                />
                <div className='mt-4'>
                  <h3 className='font-semibold text-slate-900 line-clamp-2'>{course.title}</h3>
                  <p className='mt-1 text-sm text-slate-600 line-clamp-2'>
                    {course.description || course.overview || 'Learn with structured lessons.'}
                  </p>
                  <div className='mt-3 flex flex-wrap gap-3 text-xs text-slate-500'>
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
                  <button
                    type='button'
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className='mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800'
                  >
                    View course
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popular Skills */}
      <section className='bg-white border-y border-slate-200'>
        <div className='max-w-6xl mx-auto px-6 py-12'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900'>Popular skills</h2>
              <p className='text-sm text-slate-600'>Jump into a focused learning track.</p>
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
                className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz / Practice */}
      <section className='max-w-6xl mx-auto px-6 py-12'>
        <div className='rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-emerald-200'>Quiz and practice</p>
              <h2 className='mt-2 text-2xl font-bold'>Practice what you learn</h2>
              <p className='mt-2 text-sm text-slate-200'>
                Quizzes are generated inside your courses. Jump back into learning to practice.
              </p>
            </div>
            <button
              type='button'
              onClick={handleGoToYourCourses}
              className='inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600'
            >
              Start practice
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </section>

      {/* Explore Courses */}
      <section id='explore' className='max-w-6xl mx-auto w-full px-4 lg:px-6 pb-16'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Explore courses</h2>
          <p className='text-sm text-slate-600'>Search or browse the full catalog.</p>
        </div>
        <div className='rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm'>
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
