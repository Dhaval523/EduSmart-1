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
  if (resource?.type === 'link') return <Link2 className="w-4 h-4" />
  const mime = resource?.mimeType || ''
  if (mime.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
  return <FileText className="w-4 h-4" />
}

const LockedModuleState = ({ onUnlock }) => (
  <div className="flex h-full flex-col items-center justify-center text-center px-8">
    <div className="rounded-full border border-amber-400/40 bg-amber-400/10 p-4 text-amber-300">
      <Lock className="h-8 w-8" />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-slate-100">Locked module</h3>
    <p className="mt-2 text-sm text-slate-400 max-w-md">
      Purchase the course to unlock this module and access quizzes, resources, and progress tracking.
    </p>
    <button
      type="button"
      onClick={onUnlock}
      className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
    >
      Unlock Course
    </button>
  </div>
)

const PreviewModeBanner = () => (
  <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
    <BadgeCheck className="h-4 w-4" />
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
  const lockedMode = Boolean(selectedModule && !isPurchased && !selectedModule.isPreviewFree)

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
      <div className="h-screen flex items-center justify-center bg-[#0b0f14]">
        <Spinner />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-slate-200">
        Course not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(700px_circle_at_90%_20%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(600px_circle_at_20%_90%,rgba(99,102,241,0.12),transparent_60%)]" />
      <div className="relative flex h-screen">
        {/* Left - Video & Activity */}
        <div className="w-1/2 flex flex-col border-r border-white/10 bg-[#0f141b]/90 backdrop-blur">
          <div className="h-[50%] bg-[#0b0f14] flex flex-col justify-center p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Now Playing</p>
                <h2 className="text-lg font-semibold text-slate-100">
                  {selectedModule?.title || 'Select a module'}
                </h2>
              </div>
              {previewMode ? <PreviewModeBanner /> : null}
            </div>

            {selectedModule ? (
              canAccessSelectedModule ? (
                <ModuleVideoPlayer url={selectedModule.video} onEnded={handleVideoEnded} />
              ) : (
                <LockedModuleState onUnlock={() => navigate(`/courses/${courseId}`)} />
              )
            ) : (
              <div className="text-center text-slate-400">
                <p className="text-lg font-semibold">Select a module to watch</p>
                <p className="text-sm text-slate-500 mt-2">
                  Preview modules are available before purchase
                </p>
              </div>
            )}
          </div>

          {/* Resources + Comments */}
          <div className="flex-1 bg-[#0f141b]/80 flex flex-col">
            {canAccessSelectedModule && selectedModule?.resources?.length ? (
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-300" />
                  <h2 className="text-lg font-bold text-slate-100">Resources</h2>
                  <span className="text-sm text-slate-400">
                    ({selectedModule.resources.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedModule.resources.map((res, idx) => (
                    <a
                      key={`${res.url}-${idx}`}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-200 transition-colors"
                    >
                      {getResourceIcon(res)}
                      <span className="truncate">
                        {res.title || res.fileName || res.url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {isPurchased ? (
              <>
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-300" />
                    <h2 className="text-lg font-bold text-slate-100">Comments</h2>
                    <span className="text-sm text-slate-400">
                      ({comments?.length || 0})
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {comments?.length ? (
                    comments.map((item, index) => (
                      <div key={item._id || index} className="bg-[#111827]/70 rounded-xl p-4 border border-white/10">
                        <p className="text-slate-100 text-sm leading-relaxed">
                          {item.comment}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400">
                            {item.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-slate-500">.</span>
                          <span className="text-xs text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageCircle className="w-16 h-16 text-slate-600 mb-4" />
                      <p className="text-slate-400">No comments yet</p>
                      <p className="text-sm text-slate-500">Be the first to comment!</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-white/10 bg-[#0f141b]/80">
                  <form onSubmit={handleSubmit(handleCommentSubmit)} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-[#0b0f14] text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      {...register('comment', { required: true })}
                    />
                    <button
                      type="submit"
                      disabled={!selectedModule?._id}
                      className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center px-6 text-center text-sm text-slate-500">
                Comments are available after purchase.
              </div>
            )}
          </div>
        </div>

        {/* Right - Modules */}
        <div className="w-1/2 bg-[#0f141b]/80 overflow-y-auto border-l border-white/5 backdrop-blur">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Course Content</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {isPurchased ? 'Track your progress module by module' : 'Preview available modules below'}
                </p>
              </div>
              {isPurchased ? (
                <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                  {percent}% Complete
                </div>
              ) : null}
            </div>

            {isPurchased ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-200">Progress</span>
                  <span className="text-sm text-slate-400">
                    {completedCount}/{totalModules} ({percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {modules.length ? modules.map((item, index) => {
                const isSelected = String(item._id) === String(selectedModuleId)
                const isLocked = !isPurchased && !item.isPreviewFree
                return (
                  <button
                    key={item._id || index}
                    type="button"
                    onClick={() => handleModuleSelect(item)}
                    className={`w-full text-left rounded-2xl border transition-all px-5 py-4 ${
                      isSelected
                        ? 'border-emerald-400/40 bg-emerald-500/10'
                        : 'border-white/10 bg-[#0b0f14]/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold text-slate-200">
                        {item.order ?? index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100">{item.title}</span>
                          {item.isPreviewFree && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-200">
                              Preview free
                            </span>
                          )}
                          {completedSet.has(item._id) && isPurchased && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-2 py-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-200 bg-amber-500/10 border border-amber-400/30 rounded-full px-2 py-1">
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          )}
                        </div>
                        {item.description ? (
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <PlayCircle className="w-5 h-5 text-slate-500" />
                    </div>

                    {isSelected && isPurchased ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {!item.quiz ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              createQuizHandler(item)
                            }}
                            disabled={isCreatingQuiz && creatingModuleId === item._id}
                            className="relative px-4 py-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isCreatingQuiz && creatingModuleId === item._id ? (
                              <>Creating...</>
                            ) : (
                              <>
                                <FileQuestion className="w-4 h-4" />
                                Create Quiz
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/quiz/${item.quiz}`)
                            }}
                            className="relative px-4 py-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                          >
                            <FileQuestion className="w-4 h-4" />
                            View Quiz
                          </button>
                        )}
                      </div>
                    ) : null}

                    {isSelected && item.quiz && isPurchased ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-[#0b0f14]/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Quiz</p>
                        {isQuizLoading ? (
                          <p className="mt-2 text-sm text-slate-400">Loading questions...</p>
                        ) : (
                          <>
                            <p className="mt-2 text-sm text-slate-200">
                              {quizData?.quiz?.questions?.length || 0} questions
                            </p>
                            <div className="mt-3 space-y-3">
                              {(quizData?.quiz?.questions || []).slice(0, 5).map((q, idx) => (
                                <div key={q._id || idx} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                                  <span className="text-xs text-slate-400">Q{idx + 1}</span>
                                  <p className="mt-1">{q.content}</p>
                                </div>
                              ))}
                              {quizData?.quiz?.questions?.length > 5 ? (
                                <p className="text-xs text-slate-400">Open quiz to see all questions.</p>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                  </button>
                )
              }) : (
                <div className="rounded-2xl border border-white/10 bg-[#0b0f14]/70 p-6 text-center text-sm text-slate-400">
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
