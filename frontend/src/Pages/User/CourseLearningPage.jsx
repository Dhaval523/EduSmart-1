import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGetSingleCourseHook, useGetAllPurchaseCourse } from '@/hooks/course.hook'
import { useGetComment } from '@/hooks/module.hook'
import { useCreateComment } from '@/hooks/comment.hook'
import { useCreateQuiz, useGetQuiz } from '@/hooks/quiz.hook'
import { useGetCourseProgress, useMarkModuleComplete } from '@/hooks/progress.hook'
import { ModuleVideoPlayer } from '@/components/ModuleVideoPlayer'
import { Spinner } from '@/components/ui/spinner'
import {
  CheckCircle2,
  FileQuestion,
  Link2,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Lock,
  PlayCircle,
  BadgeCheck
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const getResourceIcon = (resource) => {
  if (resource?.type === 'link') return <Link2 className='w-4 h-4' />
  const mime = resource?.mimeType || ''
  if (mime.startsWith('image/')) return <ImageIcon className='w-4 h-4' />
  return <FileText className='w-4 h-4' />
}

const LockedModuleState = ({ onUnlock }) => (
  <div className='flex flex-col items-center justify-center text-center py-10'>
    <div className='rounded-full border border-gray-200 bg-[#FFF2EE] p-4 text-[#F5B7A1]'>
      <Lock className='h-8 w-8' />
    </div>
    <h3 className='mt-4 text-xl font-semibold text-[#1F2937]'>Locked module</h3>
    <p className='mt-2 text-sm text-[#6B7280] max-w-md'>
      Purchase the course to unlock this module and access quizzes, resources, and progress tracking.
    </p>
    <button type='button' onClick={onUnlock} className='mt-6 btn-primary'>
      Unlock Course
    </button>
  </div>
)

const PreviewModeBanner = () => (
  <div className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-[#1F2937]'>
    <BadgeCheck className='h-4 w-4 text-[#1F2937]' />
    Preview mode - purchase to unlock full course features.
  </div>
)

const CourseLearningPage = () => {
  const { courseId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm()

  const { data: course, isLoading } = useGetSingleCourseHook(courseId)
  const { data: purchaseData } = useGetAllPurchaseCourse()
  const isPurchased = React.useMemo(() => {
    if (course?.isPurchased) return true
    const purchased = purchaseData?.purchasedCourse || []
    return purchased?.some?.((c) => String(c?._id) === String(courseId))
  }, [course?.isPurchased, purchaseData, courseId])

  const modules = React.useMemo(() => {
    if (!Array.isArray(course?.modules)) return []
    return [...course.modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [course?.modules])

  const moduleIdFromUrl = searchParams.get('module')
  const [selectedModuleId, setSelectedModuleId] = React.useState(moduleIdFromUrl || null)

  React.useEffect(() => {
    if (!modules.length) return
    const nextId = moduleIdFromUrl && modules.find((m) => String(m._id) === String(moduleIdFromUrl))
      ? moduleIdFromUrl
      : modules[0]._id
    setSelectedModuleId(nextId)
  }, [moduleIdFromUrl, modules])

  const selectedModule = modules.find((m) => String(m._id) === String(selectedModuleId)) || null

  const canAccessSelectedModule = Boolean(
    selectedModule && (isPurchased || selectedModule.isPreviewFree)
  )
  const previewMode = Boolean(selectedModule && !isPurchased && selectedModule.isPreviewFree)

  const { data: progressData } = useGetCourseProgress(courseId, isPurchased)
  const { mutate: markComplete } = useMarkModuleComplete(courseId)
  const completedSet = new Set(progressData?.completedModuleIds || [])
  const totalModules = progressData?.totalModules || modules.length || 0
  const completedCount = progressData?.completedCount || 0
  const percent = progressData?.percent || 0

  const { data: comments } = useGetComment(isPurchased ? selectedModule?._id : null)
  const { mutate: createComment } = useCreateComment()

  const quizId = isPurchased ? (selectedModule?.quiz?._id || selectedModule?.quiz) : null
  const { data: quizData, isLoading: isQuizLoading } = useGetQuiz(quizId)
  const { mutate: createQuiz, isPending: isCreatingQuiz } = useCreateQuiz()
  const [creatingModuleId, setCreatingModuleId] = React.useState(null)

  const handleModuleSelect = (mod) => {
    if (!mod?._id) return
    setSelectedModuleId(mod._id)
    setSearchParams({ module: mod._id })
  }

  const handleVideoEnded = () => {
    if (!isPurchased || !selectedModule?._id || !courseId) return
    if (completedSet.has(selectedModule._id)) return
    markComplete(
      { courseId, moduleId: selectedModule._id },
      { onSuccess: () => toast.success('Module marked as completed') }
    )
  }

  const handleCommentSubmit = (formData) => {
    if (!selectedModule?._id) return
    createComment(
      { id: selectedModule._id, payload: formData },
      {
        onSuccess: () => {
          reset()
          toast.success('Comment posted!')
        }
      }
    )
  }

  const createQuizHandler = (moduleData) => {
    if (!isPurchased) return
    setCreatingModuleId(moduleData._id)
    createQuiz(
      {
        moduleId: moduleData._id,
        content: moduleData.title,
        courseId
      },
      {
        onSuccess: (res) => {
          if (res?.module) {
            setSelectedModuleId(res.module._id)
          }
        },
        onSettled: () => setCreatingModuleId(null)
      }
    )
  }

  if (isLoading) {
    return (
      <div className='page-bg flex items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!course) {
    return (
      <div className='page-bg flex items-center justify-center text-[#6B7280]'>
        Course not found.
      </div>
    )
  }

  return (
    <div className='page-bg'>
      <div className='page-shell py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='card'>
            <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-[#6B7280]'>Now Playing</p>
                <h2 className='heading text-[#1F2937]'>
                  {selectedModule?.title || 'Select a module'}
                </h2>
              </div>
              {previewMode ? <PreviewModeBanner /> : null}
            </div>

            <div className='w-full aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6'>
              {selectedModule ? (
                canAccessSelectedModule ? (
                  <ModuleVideoPlayer url={selectedModule.video} onEnded={handleVideoEnded} />
                ) : (
                  <LockedModuleState onUnlock={() => navigate(`/courses/${courseId}`)} />
                )
              ) : (
                <div className='h-full flex items-center justify-center text-center text-[#6B7280]'>
                  <div>
                    <p className='text-lg font-semibold text-[#1F2937]'>Select a module to watch</p>
                    <p className='text-sm text-[#6B7280] mt-2'>Preview modules are available before purchase</p>
                  </div>
                </div>
              )}
            </div>

            {canAccessSelectedModule && selectedModule?.resources?.length ? (
              <div className='mb-6'>
                <div className='flex items-center gap-2 mb-3'>
                  <FileText className='w-5 h-5 text-[#1F2937]' />
                  <h2 className='heading text-[#1F2937]'>Resources</h2>
                  <span className='text-sm text-[#6B7280]'>({selectedModule.resources.length})</span>
                </div>
                <div className='space-y-2'>
                  {selectedModule.resources.map((res, idx) => (
                    <a
                      key={`${res.url}-${idx}`}
                      href={res.url}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-[#1F2937] transition hover:bg-[#F7F7FB]'
                    >
                      {getResourceIcon(res)}
                      <span className='truncate'>{res.title || res.fileName || res.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {isPurchased ? (
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <MessageCircle className='w-5 h-5 text-[#1F2937]' />
                  <h2 className='heading text-[#1F2937]'>Comments</h2>
                  <span className='text-sm text-[#6B7280]'>({comments?.length || 0})</span>
                </div>

                <div className='max-h-[360px] overflow-y-auto pr-2 space-y-4'>
                  {comments?.length ? (
                    comments.map((item, index) => (
                      <div key={item._id || index} className='bg-white rounded-xl p-4 border border-gray-200'>
                        <p className='text-[#1F2937] text-sm leading-relaxed'>{item.comment}</p>
                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-xs text-[#6B7280]'>
                            {item.user?.name || 'Anonymous'}
                          </span>
                          <span className='text-xs text-gray-400'>.</span>
                          <span className='text-xs text-[#6B7280]'>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center py-10 text-center'>
                      <MessageCircle className='w-12 h-12 text-gray-300 mb-3' />
                      <p className='text-[#6B7280]'>No comments yet</p>
                      <p className='text-sm text-gray-400'>Be the first to comment!</p>
                    </div>
                  )}
                </div>

                <div className='mt-4'>
                  <form onSubmit={handleSubmit(handleCommentSubmit)} className='flex flex-col gap-3 sm:flex-row'>
                    <input
                      type='text'
                      placeholder='Add a comment...'
                      className='flex-1 px-4 py-3'
                      {...register('comment', { required: true })}
                    />
                    <button
                      type='submit'
                      disabled={!selectedModule?._id}
                      className='btn-primary w-full sm:w-auto flex items-center justify-center gap-2'
                    >
                      <Send className='w-4 h-4' />
                      Post
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className='text-center text-sm text-[#6B7280]'>
                Comments are available after purchase.
              </div>
            )}
          </div>

          <div className='card'>
            <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
              <div>
                <h2 className='heading text-[#1F2937]'>Course Content</h2>
                <p className='desc'>
                  {isPurchased ? 'Track your progress module by module' : 'Preview available modules below'}
                </p>
              </div>
              {isPurchased ? (
                <div className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-[#1F2937]'>
                  {percent}% Complete
                </div>
              ) : null}
            </div>

            {isPurchased ? (
              <div className='mb-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-semibold text-[#1F2937]'>Progress</span>
                  <span className='text-sm text-[#6B7280]'>
                    {completedCount}/{totalModules} ({percent}%)
                  </span>
                </div>
                <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-[#6C5DD3] to-[#A29BFE] transition-all'
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className='h-[500px] lg:h-full overflow-y-auto pr-2 space-y-3'>
              {modules.length ? modules.map((item, index) => {
                const isSelected = String(item._id) === String(selectedModuleId)
                const isLocked = !isPurchased && !item.isPreviewFree
                return (
                  <button
                    key={item._id || index}
                    type='button'
                    onClick={() => handleModuleSelect(item)}
                    className={`w-full text-left rounded-2xl border transition-all px-5 py-4 ${
                      isSelected
                        ? 'border-[#A29BFE] bg-[#F7F5FF]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-[#1F2937]'>
                        {item.order ?? index + 1}
                      </div>
                      <div className='flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='font-semibold text-[#1F2937]'>{item.title}</span>
                          {item.isPreviewFree && (
                            <span className='chip'>Preview free</span>
                          )}
                          {completedSet.has(item._id) && isPurchased && (
                            <span className='inline-flex items-center gap-1 text-xs font-semibold text-[#1F2937] bg-gray-100 border border-gray-200 rounded-full px-2 py-1'>
                              <CheckCircle2 className='w-3 h-3' />
                              Completed
                            </span>
                          )}
                          {isLocked && (
                            <span className='inline-flex items-center gap-1 text-xs font-semibold text-[#F5B7A1] bg-[#FFF2EE] border border-gray-200 rounded-full px-2 py-1'>
                              <Lock className='w-3 h-3' />
                              Locked
                            </span>
                          )}
                        </div>
                        {item.description ? (
                          <p className='mt-1 text-xs text-[#6B7280] line-clamp-2'>
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <PlayCircle className='w-5 h-5 text-gray-400' />
                    </div>

                    {isSelected && isPurchased ? (
                      <div className='mt-4 flex flex-wrap gap-3'>
                        {!item.quiz ? (
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation()
                              createQuizHandler(item)
                            }}
                            disabled={isCreatingQuiz && creatingModuleId === item._id}
                            className='btn-primary px-4 py-2 text-sm'
                          >
                            {isCreatingQuiz && creatingModuleId === item._id ? (
                              <>Creating...</>
                            ) : (
                              <>
                                <FileQuestion className='w-4 h-4' />
                                Create Quiz
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/quiz/${item.quiz}`)
                            }}
                            className='btn-primary px-4 py-2 text-sm'
                          >
                            <FileQuestion className='w-4 h-4' />
                            View Quiz
                          </button>
                        )}
                      </div>
                    ) : null}

                    {isSelected && item.quiz && isPurchased ? (
                      <div className='mt-4 rounded-xl border border-gray-200 bg-white p-4'>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]'>Quiz</p>
                        {isQuizLoading ? (
                          <p className='mt-2 text-sm text-[#6B7280]'>Loading questions...</p>
                        ) : (
                          <>
                            <p className='mt-2 text-sm text-[#6B7280]'>
                              {quizData?.quiz?.questions?.length || 0} questions
                            </p>
                            <div className='mt-3 space-y-3'>
                              {(quizData?.quiz?.questions || []).slice(0, 5).map((q, idx) => (
                                <div key={q._id || idx} className='rounded-lg border border-gray-200 bg-white p-3 text-sm text-[#1F2937]'>
                                  <span className='text-xs text-gray-400'>Q{idx + 1}</span>
                                  <p className='mt-1'>{q.content}</p>
                                </div>
                              ))}
                              {quizData?.quiz?.questions?.length > 5 ? (
                                <p className='text-xs text-gray-400'>Open quiz to see all questions.</p>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                  </button>
                )
              }) : (
                <div className='rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-[#6B7280]'>
                  Modules will appear once available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseLearningPage







