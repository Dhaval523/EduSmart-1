import { useCreateCouseHook, useDeleteCourseHook, useGetCourseHook } from '@/hooks/course.hook'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Search, Plus, Eye, Edit3, Trash2, Layers, Upload } from 'lucide-react'

const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'classification', label: 'Classification' },
  { id: 'learning', label: 'Learning' }
]

const categoryOptions = {
  Development: ["Frontend", "Backend", "Full Stack", "Mobile Development", "DevOps", "Database"],
  "Data & AI": ["Programming", "Data Analysis", "SQL", "Machine Learning", "Visualization", "BI Tools", "Automation", "Generative AI"],
  Design: ["UI Design", "UX Design", "Figma", "Design Systems", "Mobile UI", "Portfolio", "Content Design"],
  Business: ["Marketing", "Analytics", "Project Management", "Productivity", "Spreadsheets"],
  Career: ["Job Search", "Interview Prep", "Soft Skills", "Aptitude", "Freelancing", "Career Path", "AI Productivity"]
}

const levelOptions = ["Beginner", "Intermediate", "Advanced", "All Levels"]

const DashboardProducts = () => {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: null,
    category: '',
    subcategory: '',
    level: '',
    duration: '',
    instructor: '',
    tags: '',
    amount: '',
    overview: '',
    requirements: '',
    learningOutcomes: ''
  })

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    level: '',
    instructor: '',
    published: '',
    hasThumbnail: '',
    hasModules: '',
    sort: 'updated_desc',
    page: 1,
    limit: 10
  })

  const params = useMemo(() => ({
    search: filters.search || undefined,
    category: filters.category || undefined,
    subcategory: filters.subcategory || undefined,
    level: filters.level || undefined,
    instructor: filters.instructor || undefined,
    published: filters.published || undefined,
    hasThumbnail: filters.hasThumbnail || undefined,
    hasModules: filters.hasModules || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit
  }), [filters])

  const { data, isLoading } = useGetCourseHook(params)
  const { mutate, isPending } = useCreateCouseHook()
  const { mutate: deleteCourse } = useDeleteCourseHook()

  const totalPages = data?.meta?.totalPages || 1
  const subcategoryOptions = form.category ? categoryOptions[form.category] || [] : []

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleThumbnail = (file) => {
    onChange('thumbnail', file || null)
    if (!file) {
      setThumbnailPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setThumbnailPreview(url)
  }

  const submitHandler = () => {
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('description', form.description)
    payload.append('amount', Number(form.amount || 0))
    payload.append('category', form.category || '')
    payload.append('subcategory', form.subcategory || '')
    payload.append('level', form.level || '')
    payload.append('duration', form.duration || '')
    payload.append('instructor', form.instructor || '')
    payload.append('tags', form.tags || '')
    payload.append('overview', form.overview || '')
    payload.append('requirements', form.requirements || '')
    payload.append('learningOutcomes', form.learningOutcomes || '')

    if (form.thumbnail) {
      payload.append('thumbnail', form.thumbnail)
    }

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.message)
        setDrawerOpen(false)
        if (res?.newCourse?._id) {
          navigate(`/admin/courses/${res.newCourse._id}`)
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-500">Search, filter, and manage your course catalog</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                placeholder="Search title, instructor, category, tags"
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-72"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="">All Categories</option>
              {Object.keys(categoryOptions).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="">All Levels</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filters.published}
              onChange={(e) => setFilters({ ...filters, published: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>

            <select
              value={filters.hasThumbnail}
              onChange={(e) => setFilters({ ...filters, hasThumbnail: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="">Thumbnail</option>
              <option value="true">Has thumbnail</option>
              <option value="false">Missing thumbnail</option>
            </select>

            <select
              value={filters.hasModules}
              onChange={(e) => setFilters({ ...filters, hasModules: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="">Modules</option>
              <option value="true">Has modules</option>
              <option value="false">No modules</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2"
            >
              <option value="updated_desc">Recently updated</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
              <option value="price_asc">Price low-high</option>
              <option value="price_desc">Price high-low</option>
              <option value="modules_desc">Most modules</option>
            </select>
          </div>

          <button
            onClick={() => {
              setDrawerOpen(true)
              setActiveTab('details')
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] table-fixed text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="border-b border-slate-200">
                <th className="text-left px-6 py-4 font-semibold w-[380px]">Course</th>
                <th className="text-left px-4 py-4 font-semibold w-[170px]">Category</th>
                <th className="text-left px-4 py-4 font-semibold w-[120px]">Level</th>
                <th className="text-left px-4 py-4 font-semibold w-[160px]">Instructor</th>
                <th className="text-left px-4 py-4 font-semibold w-[120px]">Duration</th>
                <th className="text-left px-4 py-4 font-semibold w-[120px]">Price</th>
                <th className="text-left px-4 py-4 font-semibold w-[110px]">Modules</th>
                <th className="text-left px-4 py-4 font-semibold w-[140px]">Status</th>
                <th className="text-left px-4 py-4 font-semibold w-[140px]">Updated</th>
                <th className="text-left px-4 py-4 font-semibold w-[180px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="p-8" colSpan={10}>
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </td>
                </tr>
              ) : (data?.courses || []).length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={10}>
                    No courses found.
                  </td>
                </tr>
              ) : (
                (data?.courses || []).map((course) => (
                  <tr key={course._id} className="border-t border-slate-200 hover:bg-slate-50/80 align-top">
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-4 min-w-0">
                        <img
                          src={course.thumbnail || 'https://via.placeholder.com/120x80?text=No+Image'}
                          alt={course.title}
                          className="h-16 w-24 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 text-lg leading-6 truncate">
                            {course.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-5">
                            {course.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-6">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {course.category || '—'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 truncate">
                          {course.subcategory || 'General'}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap text-slate-800">
                      {course.level || '—'}
                    </td>

                    <td className="px-4 py-6">
                      <div className="max-w-[140px]">
                        <p className="text-slate-900 leading-6 break-words">
                          {course.instructor || '—'}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap text-slate-800">
                      {course.duration || '—'}
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">
                        ₹ {Number(course.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap text-slate-800">
                      {course.modules?.length || 0}
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          course.isPublished
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap text-sm text-slate-500">
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/admin/courses/${course._id}`)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/courses/${course._id}`)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/courses/${course._id}`)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                          title="Modules"
                        >
                          <Layers className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Delete this course?')) {
                              deleteCourse(course._id)
                            }
                          }}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Page {data?.meta?.page || 1} of {totalPages} • {data?.meta?.total || 0} courses
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
              className="border border-slate-200 rounded-lg text-sm px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters({ ...filters, page: Math.max(filters.page - 1, 1) })}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={filters.page >= totalPages}
              onClick={() => setFilters({ ...filters, page: Math.min(filters.page + 1, totalPages) })}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-50 h-full w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create Course</h2>
                <p className="text-xs text-slate-500">Capture the essentials to start building content.</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-500">✕</button>
            </div>

            <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-28">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Course Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => onChange('title', e.target.value)}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Short Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => onChange('description', e.target.value)}
                      rows={3}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Thumbnail / Cover Image</label>
                    <div className="mt-2 border border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-4">
                      <div className="h-20 w-28 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center text-xs text-slate-500">
                        {thumbnailPreview ? (
                          <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-full object-cover" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Recommended landscape image for course cards and course pages.</p>
                        <input
                          type="file"
                          onChange={(e) => handleThumbnail(e.target.files?.[0])}
                          className="mt-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'classification' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => {
                        onChange('category', e.target.value)
                        onChange('subcategory', '')
                      }}
                      className="mt-2 w-full p-3 border rounded-lg"
                    >
                      <option value="">Select category</option>
                      {Object.keys(categoryOptions).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Subcategory</label>
                    <select
                      value={form.subcategory}
                      onChange={(e) => onChange('subcategory', e.target.value)}
                      className="mt-2 w-full p-3 border rounded-lg"
                      disabled={!form.category}
                    >
                      <option value="">Select subcategory</option>
                      {subcategoryOptions.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Level</label>
                    <select
                      value={form.level}
                      onChange={(e) => onChange('level', e.target.value)}
                      className="mt-2 w-full p-3 border rounded-lg"
                    >
                      <option value="">Select level</option>
                      {levelOptions.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Duration</label>
                    <input
                      value={form.duration}
                      onChange={(e) => onChange('duration', e.target.value)}
                      placeholder="e.g. 8 weeks"
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Instructor</label>
                    <input
                      value={form.instructor}
                      onChange={(e) => onChange('instructor', e.target.value)}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Tags</label>
                    <input
                      value={form.tags}
                      onChange={(e) => onChange('tags', e.target.value)}
                      placeholder="comma-separated"
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => onChange('amount', e.target.value)}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Overview</label>
                    <textarea
                      value={form.overview}
                      onChange={(e) => onChange('overview', e.target.value)}
                      rows={3}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Requirements</label>
                    <p className="text-xs text-slate-500">Enter one requirement per line.</p>
                    <textarea
                      value={form.requirements}
                      onChange={(e) => onChange('requirements', e.target.value)}
                      rows={3}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Learning Outcomes</label>
                    <p className="text-xs text-slate-500">Enter one learning outcome per line.</p>
                    <textarea
                      value={form.learningOutcomes}
                      onChange={(e) => onChange('learningOutcomes', e.target.value)}
                      rows={3}
                      className="mt-2 w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4 bg-white sticky bottom-0">
              <button
                disabled={isPending}
                onClick={submitHandler}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold"
              >
                {isPending ? <Spinner /> : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DashboardProducts