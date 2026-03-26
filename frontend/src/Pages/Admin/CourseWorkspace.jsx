import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSingleCourseHook, useUpdateCourseHook } from '@/hooks/course.hook'
import { useCreateModule, useDeleteModule, useUpdateModule } from '@/hooks/module.hook'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircle2, Layers, Plus, Trash2, Edit3 } from 'lucide-react'

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'classification', label: 'Classification' },
  { id: 'learning', label: 'Learning' },
  { id: 'modules', label: 'Modules' },
  { id: 'publishing', label: 'Publishing' }
]

const CourseWorkspace = () => {
  const { id } = useParams()
  const { data: course, isLoading } = useGetSingleCourseHook(id)
  const { mutate: updateCourse, isPending } = useUpdateCourseHook()
  const { mutate: createModule, isPending: isCreatingModule } = useCreateModule()
  const { mutate: updateModule, isPending: isUpdatingModule } = useUpdateModule()
  const { mutate: deleteModule } = useDeleteModule()

  const [activeTab, setActiveTab] = useState('details')
  const [form, setForm] = useState({})
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [moduleForm, setModuleForm] = useState({})

  useEffect(() => {
    if (!course) return
    setForm({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      subcategory: course.subcategory || '',
      level: course.level || '',
      duration: course.duration || '',
      instructor: course.instructor || '',
      tags: (course.tags || []).join(', '),
      amount: course.amount || '',
      overview: course.overview || '',
      requirements: (course.requirements || []).join('\n'),
      learningOutcomes: (course.learningOutcomes || []).join('\n'),
      isPublished: course.isPublished
    })
  }, [course])

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const saveCourse = () => {
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('description', form.description)
    payload.append('amount', form.amount)
    payload.append('category', form.category || '')
    payload.append('subcategory', form.subcategory || '')
    payload.append('level', form.level || '')
    payload.append('duration', form.duration || '')
    payload.append('instructor', form.instructor || '')
    payload.append('tags', form.tags || '')
    payload.append('overview', form.overview || '')
    payload.append('requirements', form.requirements || '')
    payload.append('learningOutcomes', form.learningOutcomes || '')
    payload.append('isPublished', form.isPublished || false)

    updateCourse({ id, payload })
  }

  const openModuleEditor = (module) => {
    setEditingModule(module || null)
    setModuleFormOpen(true)
    setModuleForm({
      title: module?.title || '',
      description: module?.description || '',
      order: module?.order || 0,
      duration: module?.duration || '',
      isPreviewFree: module?.isPreviewFree || false,
      video: null,
      resourceLinks: ''
    })
  }

  const handleModuleSubmit = () => {
    const payload = new FormData()
    payload.append('title', moduleForm.title)
    payload.append('description', moduleForm.description || '')
    payload.append('order', moduleForm.order || 0)
    payload.append('duration', moduleForm.duration || '')
    payload.append('isPreviewFree', moduleForm.isPreviewFree ? 'true' : 'false')
    payload.append('courseId', id)
    if (moduleForm.video) payload.append('video', moduleForm.video)
    if (moduleForm.resourceLinks) payload.append('resourceLinks', moduleForm.resourceLinks)

    if (editingModule) {
      updateModule({ id: editingModule._id, payload }, { onSuccess: () => setModuleFormOpen(false) })
    } else {
      createModule(payload, { onSuccess: () => setModuleFormOpen(false) })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen p-8">Course not found.</div>
    )
  }

  const modules = [...(course.modules || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Manage Course</h1>
          <p className="text-[#6B7280]">{course.title}</p>
        </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border ${activeTab === tab.id ? 'bg-[#6C5DD3] text-white border-[#6C5DD3]' : 'bg-white border-gray-200 text-[#6B7280]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Title" className="w-full p-3 border rounded-lg" />
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Description" rows={3} className="w-full p-3 border rounded-lg" />
          </div>
        )}

        {activeTab === 'classification' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.category} onChange={(e) => updateField('category', e.target.value)} placeholder="Category" className="w-full p-3 border rounded-lg" />
            <input value={form.subcategory} onChange={(e) => updateField('subcategory', e.target.value)} placeholder="Subcategory" className="w-full p-3 border rounded-lg" />
            <input value={form.level} onChange={(e) => updateField('level', e.target.value)} placeholder="Level" className="w-full p-3 border rounded-lg" />
            <input value={form.duration} onChange={(e) => updateField('duration', e.target.value)} placeholder="Duration" className="w-full p-3 border rounded-lg" />
            <input value={form.instructor} onChange={(e) => updateField('instructor', e.target.value)} placeholder="Instructor" className="w-full p-3 border rounded-lg" />
            <input value={form.amount} onChange={(e) => updateField('amount', e.target.value)} placeholder="Price" className="w-full p-3 border rounded-lg" />
            <input value={form.tags} onChange={(e) => updateField('tags', e.target.value)} placeholder="Tags" className="w-full p-3 border rounded-lg" />
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-4">
            <textarea value={form.overview} onChange={(e) => updateField('overview', e.target.value)} placeholder="Overview" rows={3} className="w-full p-3 border rounded-lg" />
            <textarea value={form.requirements} onChange={(e) => updateField('requirements', e.target.value)} placeholder="Requirements" rows={3} className="w-full p-3 border rounded-lg" />
            <textarea value={form.learningOutcomes} onChange={(e) => updateField('learningOutcomes', e.target.value)} placeholder="Learning outcomes" rows={3} className="w-full p-3 border rounded-lg" />
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-4">
            <button onClick={() => openModuleEditor(null)} className="inline-flex items-center gap-2 rounded-xl bg-[#6C5DD3] px-3 py-2 text-sm font-semibold text-white">
              <Plus className="w-4 h-4" /> Add Module
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod) => (
                <div key={mod._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{mod.title}</p>
                      <p className="text-xs text-[#6B7280]">
                        Order {mod.order ?? 0} - {mod.duration || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModuleEditor(mod)} className="p-2 border rounded-lg"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => deleteModule(mod._id)} className="p-2 border border-red-200 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {mod.isPreviewFree ? (
                    <span className="mt-2 inline-flex items-center rounded-full bg-[#EDEBFF] px-2 py-0.5 text-xs text-[#6C5DD3]">Preview free</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'publishing' && (
          <div className="space-y-3">
            <p className="text-sm text-[#6B7280]">Modules: {modules.length}</p>
            <p className="text-sm text-[#6B7280]">Status: {course.isPublished ? 'Published' : 'Draft'}</p>
            <button
              onClick={() => updateCourse({ id, payload: (() => { const p = new FormData(); p.append('isPublished', !course.isPublished); return p })() })}
              disabled={!course.isPublished && modules.length < 1}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6C5DD3] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {course.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            {modules.length < 1 ? (
              <p className="text-xs text-red-600">Add at least 1 module before publishing this course.</p>
            ) : null}
          </div>
        )}
      </div>

      <button
        onClick={saveCourse}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-[#6C5DD3] px-4 py-2 text-sm font-semibold text-white"
      >
        {isPending ? <Spinner /> : 'Save Changes'}
      </button>

      {moduleFormOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#6C5DD3]/20" onClick={() => setModuleFormOpen(false)} />
          <div className="relative z-50 bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-[#1F2937]">{editingModule ? 'Edit Module' : 'Add Module'}</h3>
            <div className="mt-4 space-y-3">
              <input value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} placeholder="Title" className="w-full p-3 border rounded-lg" />
              <textarea value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full p-3 border rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <input value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })} placeholder="Order" className="w-full p-3 border rounded-lg" />
                <input value={moduleForm.duration} onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })} placeholder="Duration" className="w-full p-3 border rounded-lg" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={moduleForm.isPreviewFree} onChange={(e) => setModuleForm({ ...moduleForm, isPreviewFree: e.target.checked })} />
                Preview free
              </label>
              <input type="file" onChange={(e) => setModuleForm({ ...moduleForm, video: e.target.files?.[0] })} className="w-full" />
              <textarea value={moduleForm.resourceLinks} onChange={(e) => setModuleForm({ ...moduleForm, resourceLinks: e.target.value })} placeholder="Resource links" rows={2} className="w-full p-3 border rounded-lg" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setModuleFormOpen(false)} className="px-3 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleModuleSubmit} className="px-3 py-2 bg-[#6C5DD3] text-white rounded-lg">
                {(isCreatingModule || isUpdatingModule) ? <Spinner /> : 'Save Module'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  )
}

export default CourseWorkspace










