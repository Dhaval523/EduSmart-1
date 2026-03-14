import { useGetPurchaseCourse } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useModuleStores } from '@/Store/module.store'
import { useGetComment } from '@/hooks/module.hook'
import { useForm } from 'react-hook-form'
import { useCreateComment } from '@/hooks/comment.hook'
import { useCheckQuiz, useCreateQuiz } from '@/hooks/quiz.hook'
import { MessageCircle, Send, PlayCircle, FileQuestion, CheckCircle2, Loader2, Link2, FileText, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useGetCourseProgress, useMarkModuleComplete } from '@/hooks/progress.hook'

const SinglePurchasedCourse = () => {
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()

  const { setModule, module } = useModuleStores()
  const { id } = useParams()
  const { data } = useGetPurchaseCourse(id)
  const { data: progressData } = useGetCourseProgress(id)
  const { mutate: markComplete } = useMarkModuleComplete(id)
  
  const { data: getCommentsData } = useGetComment(module?._id)
  const { data: CheckQuiz } = useCheckQuiz(module?._id)

  const getQuizHandler = (quizId) => {
    navigate(`/quiz/${quizId}`)
  }

  const { mutate: createQuiz, isPending: isCreatingQuiz } = useCreateQuiz()
  const [creatingModuleId, setCreatingModuleId] = React.useState(null)
  const createQuizHandler = (moduleData) => {
    setCreatingModuleId(moduleData._id)
    createQuiz(
      {
        moduleId: moduleData._id,
        content: moduleData.title
      },
      {
        onSuccess: () => toast.success('Quiz created successfully!'),
        onSettled: () => setCreatingModuleId(null)
      }
    )
  }

  const videoHandler = (moduleData) => {
    setModule(moduleData)
  }

  const completedSet = new Set(progressData?.completedModuleIds || [])
  const totalModules = progressData?.totalModules || data?.modules?.length || 0
  const completedCount = progressData?.completedCount || 0
  const percent = progressData?.percent || 0

  const handleVideoEnded = () => {
    if (!module?._id || !id) return
    if (completedSet.has(module._id)) return
    markComplete(
      { courseId: id, moduleId: module._id },
      {
        onSuccess: () => toast.success("Module marked as completed")
      }
    )
  }

  const { mutate } = useCreateComment()
  const commentHandler = (data) => {
    mutate(
      {
        id: module?._id,
        payload: data
      },
      {
        onSuccess: () => {
          reset()
          toast.success('Comment posted!')
        }
      }
    )
  }

  const getResourceIcon = (resource) => {
    if (resource?.type === 'link') return <Link2 className="w-4 h-4" />
    const mime = resource?.mimeType || ''
    if (mime.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(700px_circle_at_90%_20%,rgba(56,189,248,0.10),transparent_60%),radial-gradient(600px_circle_at_20%_90%,rgba(99,102,241,0.12),transparent_60%)]" />
      <div className="relative flex h-screen">
        {/* Left - Video & Comments */}
        <div className="w-1/2 flex flex-col border-r border-white/10 bg-[#0f141b]/90 backdrop-blur">
          {/* Video Player */}
          <div className="h-[50%] bg-[#0b0f14] flex items-center justify-center p-4">
            {module?.video ? (
              <video 
                className="h-full w-full object-contain rounded-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]" 
                src={module.video}
                controls
                onEnded={handleVideoEnded}
              />
            ) : (
              <div className="text-center text-slate-400">
                <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-60" />
                <p className="text-lg font-semibold">Select a module to watch</p>
                <p className="text-sm text-slate-500 mt-2">Your progress updates when the video finishes</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="flex-1 bg-[#0f141b]/80 flex flex-col">
            {/* Resources */}
            {module?.resources?.length ? (
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-300" />
                  <h2 className="text-lg font-bold text-slate-100">Resources</h2>
                  <span className="text-sm text-slate-400">
                    ({module.resources.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {module.resources.map((res, idx) => (
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

            {/* Comments Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <h2 className="text-lg font-bold text-slate-100">Comments</h2>
                <span className="text-sm text-slate-400">
                  ({getCommentsData?.length || 0})
                </span>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {getCommentsData?.length ? (
                getCommentsData.map((item, index) => (
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

            {/* Comment Form */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#0f141b]/80">
              <form onSubmit={handleSubmit(commentHandler)} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-3 bg-[#0b0f14] text-slate-100 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  {...register('comment', { required: true })}
                />
                <button
                  type="submit"
                  disabled={!module?._id}
                  className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right - Modules */}
        <div className="w-1/2 bg-[#0f141b]/80 overflow-y-auto border-l border-white/5 backdrop-blur">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Course Content</h2>
                <p className="text-sm text-slate-400 mt-1">Track your progress module by module</p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                {percent}% Complete
              </div>
            </div>

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
            
            <div className="space-y-3">
              {data?.modules?.map((item, index) => (
                <Accordion key={item._id || index} type="single" collapsible>
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all bg-[#0b0f14]/70"
                  >
                    <AccordionTrigger 
                      onClick={() => videoHandler(item)}
                      className="px-5 py-4 bg-transparent hover:bg-white/5 text-left transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold text-slate-200">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-slate-100">{item.title}</span>
                        {completedSet.has(item._id) && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-2 py-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-5 py-4 bg-[#0f141b] border-t border-white/10">
                      <div className="flex gap-3">
                        {/* Create Quiz Button */}
                        {!item.quiz ? (
                          <button
                            onClick={() => createQuizHandler(item)}
                            disabled={isCreatingQuiz && creatingModuleId === item._id}
                            className="relative px-4 py-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isCreatingQuiz && creatingModuleId === item._id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <FileQuestion className="w-4 h-4" />
                                Create Quiz
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => getQuizHandler(item.quiz)}
                            className="relative px-4 py-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                          >
                            <FileQuestion className="w-4 h-4" />
                            Take Quiz
                          </button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePurchasedCourse
