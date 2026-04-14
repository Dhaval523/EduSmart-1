import { useGetSingleCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,DialogTrigger
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { useCreateModule, useDeleteModule, useUpdateModule } from '@/hooks/module.hook'
import { Spinner } from '@/components/ui/spinner'
import { Trash2, Edit3 } from 'lucide-react'

const CreateModule = () => {
  const { id } = useParams()
  const { data } = useGetSingleCourseHook(id)
  const [openModule, setOpenModule] = useState(false)
  const [editingModule, setEditingModule] = useState(null)

  const { register, handleSubmit, reset, setValue } = useForm()
  const { mutate, isPending } = useCreateModule()
  const { mutate: updateModule, isPending: isUpdating } = useUpdateModule()
  const { mutate: deleteModule } = useDeleteModule()

  const moduleFormHandler = (formData) => {
    const payload = new FormData()
    payload.append('title', formData.title)
    payload.append('description', formData.description || '')
    payload.append('order', formData.order || 0)
    payload.append('duration', formData.duration || '')
    payload.append('isPreviewFree', formData.isPreviewFree ? 'true' : 'false')
    if (formData.video?.[0]) {
      payload.append('video', formData.video[0])
    }
    payload.append('courseId', id)
    if (formData.resourceLinks) {
      payload.append('resourceLinks', formData.resourceLinks)
    }
    if (formData.resources?.length) {
      Array.from(formData.resources).forEach((file) => {
        payload.append('resources', file)
      })
    }

    if (editingModule) {
      updateModule({ id: editingModule._id, payload }, {
        onSuccess: () => {
          setOpenModule(false)
          setEditingModule(null)
          reset()
        }
      })
      return
    }

    mutate(payload, {
      onSuccess: () => {
        setOpenModule(false)
        reset()
      }
    })
  }

  const openEdit = (module) => {
    setEditingModule(module)
    setOpenModule(true)
    setValue('title', module.title)
    setValue('description', module.description)
    setValue('order', module.order)
    setValue('duration', module.duration)
    setValue('isPreviewFree', module.isPreviewFree)
  }

  const handleDelete = (moduleId) => {
    if (!window.confirm('Delete this module?')) return
    deleteModule(moduleId)
  }

  return (
    <div className="page-bg py-8">
      <div className="page-shell max-w-5xl">
      {/* Course Header */}
      <div className='mb-12'>
        <h1 className='text-3xl font-black text-[#0f172a] mb-2'>{data?.title}</h1>
        <div className='flex items-center gap-2 text-sm text-[#51607b]'>
          <span>Total Modules: {data?.modules?.length || 0}</span>
        </div>
      </div>

      {/* Create Module Button */}
      <Dialog open={openModule} onOpenChange={(open) => { setOpenModule(open); if (!open) { setEditingModule(null); reset() } }}>
        <DialogTrigger className='inline-flex items-center gap-2 px-6 py-3 bg-[#0ea5a4] hover:bg-[#0f766e] text-white font-semibold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          {editingModule ? 'Edit Module' : 'Create New Module'}
        </DialogTrigger>
        
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>{editingModule ? 'Edit Module' : 'New Module'}</DialogTitle>
            <form onSubmit={handleSubmit(moduleFormHandler)} className='space-y-6 mt-6'>
              <div>
                <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Module Title</label>
                <input 
                  type="text" 
                  placeholder='Enter module title'  
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0ea5a4] focus:ring-4 focus:ring-[#0f766e]/30 focus:outline-none transition-all' 
                  {...register('title', { required: true })}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Module Description</label>
                <textarea
                  rows={3}
                  placeholder='Short overview for this module'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0ea5a4] focus:ring-4 focus:ring-[#0f766e]/30 focus:outline-none transition-all'
                  {...register('description')}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Order</label>
                  <input
                    type="number"
                    placeholder='1'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0ea5a4] focus:ring-4 focus:ring-[#0f766e]/30 focus:outline-none transition-all'
                    {...register('order')}
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Duration</label>
                  <input
                    type="text"
                    placeholder='15 min'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0ea5a4] focus:ring-4 focus:ring-[#0f766e]/30 focus:outline-none transition-all'
                    {...register('duration')}
                  />
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <input
                  type="checkbox"
                  id="isPreviewFree"
                  className='h-4 w-4 rounded border-gray-300'
                  {...register('isPreviewFree')}
                />
                <label htmlFor="isPreviewFree" className='text-sm text-[#0f172a]'>
                  Mark as preview/free module
                </label>
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Video File</label>
                <input 
                  type="file" 
                  accept='video/*' 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#f5fbfa] file:text-[#0ea5a4] hover:file:bg-[#e7f5f4] transition-all cursor-pointer' 
                  {...register('video', { required: !editingModule })}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Resource Links (one per line)</label>
                <textarea
                  rows={4}
                  placeholder='https://example.com/notes.pdf\nhttps://docs.example.com/ui-guide'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0ea5a4] focus:ring-4 focus:ring-[#0f766e]/30 focus:outline-none transition-all'
                  {...register('resourceLinks')}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#0f172a] mb-2'>Upload Resources (images, PDF, PPT)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.ppt,.pptx,image/*"
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#f5fbfa] file:text-[#0ea5a4] hover:file:bg-[#e7f5f4] transition-all cursor-pointer'
                  {...register('resources')}
                />
              </div>
              
              <button 
                type='submit' 
                disabled={isPending || isUpdating}
                className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5a4] hover:bg-[#0f766e] disabled:bg-[#0ea5a4] text-white font-semibold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'
              >
                {(isPending || isUpdating) ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  editingModule ? 'Update Module' : 'Create Module'
                )}
              </button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modules List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {data?.modules?.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, index) => (
          <div key={item._id || index} className='group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer hover:border-gray-300'>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='font-bold text-lg text-[#0f172a] group-hover:text-[#0f172a]'>{item.title}</h3>
                <p className='text-sm text-[#51607b]'>Module {item.order ?? index + 1}</p>
                {item.duration ? (
                  <p className='text-xs text-gray-400 mt-1'>Duration: {item.duration}</p>
                ) : null}
              </div>
              <div className='flex items-center gap-2'>
                <button onClick={() => openEdit(item)} className='p-2 rounded-lg border border-gray-200'><Edit3 className='w-4 h-4' /></button>
                <button onClick={() => handleDelete(item._id)} className='p-2 rounded-lg border border-red-200 text-red-600'><Trash2 className='w-4 h-4' /></button>
              </div>
            </div>
            {item.description ? (
              <p className='text-sm text-[#51607b] mb-3 line-clamp-2'>{item.description}</p>
            ) : null}
            {item.isPreviewFree ? (
              <span className='inline-flex items-center rounded-full bg-[#f5fbfa] text-[#0ea5a4] px-2 py-1 text-xs font-semibold border border-gray-200'>
                Preview free
              </span>
            ) : null}
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default CreateModule







