import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminDashboard } from '@/hooks/analytic.hook'
import { BookOpen, Layers, Users, DollarSign, CheckCircle2, PlusCircle, ShoppingBag, BarChart3 } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="card flex items-center gap-4">
    <div className="h-12 w-12 rounded-2xl bg-[#6C5DD3] text-white flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.18em]">{title}</p>
      <p className="text-2xl font-black text-[#1F2937]">{value ?? '-'}</p>
    </div>
  </div>
)

const StatSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded" />
    <div className="h-8 w-20 bg-gray-200 rounded mt-3" />
  </div>
)

const WidgetSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-4 w-40 bg-gray-200 rounded" />
    <div className="mt-4 space-y-2">
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  </div>
)

const DashboardAnalytics = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useAdminDashboard()

  const kpis = data?.kpis || {}

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#1F2937]">Admin Overview</h1>
        <p className="text-[#6B7280] text-sm">Operational overview of EduSmart</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          [...Array(8)].map((_, idx) => <StatSkeleton key={idx} />)
        ) : (
          <>
            <StatCard title="Total Courses" value={kpis.totalCourses} icon={BookOpen} />
            <StatCard title="Published" value={kpis.publishedCourses} icon={CheckCircle2} />
            <StatCard title="Drafts" value={kpis.draftCourses} icon={Layers} />
            <StatCard title="Total Modules" value={kpis.totalModules} icon={Layers} />
            <StatCard title="Enrollments" value={kpis.totalEnrollments} icon={Users} />
            <StatCard title="Revenue" value={`INR ${kpis.totalRevenue ?? 0}`} icon={DollarSign} />
            <StatCard title="Completion Rate" value={`${kpis.completionRate ?? 0}%`} icon={CheckCircle2} />
            <StatCard title="Top Selling" value={data?.topSellingCourses?.[0]?.course?.title || 'N/A'} icon={ShoppingBag} />
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/admin/courses')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Course
        </button>
        <button
          onClick={() => navigate('/admin/courses')}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Manage Courses
        </button>
        <button
          onClick={() => navigate('/admin/analytics')}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" /> View Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <WidgetSkeleton />
            <WidgetSkeleton />
          </>
        ) : (
          <>
            <div className="card">
              <h2 className="text-lg font-bold text-[#1F2937]">Recent Courses</h2>
              <div className="mt-4 space-y-3">
                {(data?.recentCourses || []).map((course) => (
                  <div key={course._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{course.title}</p>
                      <p className="text-xs text-[#6B7280]">{course.category || 'Uncategorized'}</p>
                    </div>
                    <span className="text-xs text-[#6B7280]">{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {!data?.recentCourses?.length ? (
                  <p className="text-sm text-[#6B7280]">No courses yet.</p>
                ) : null}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-[#1F2937]">Recent Orders</h2>
              <div className="mt-4 space-y-3">
                {(data?.recentOrders || []).map((order) => (
                  <div key={order._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{order.course?.title || 'Course'}</p>
                      <p className="text-xs text-[#6B7280]">INR {order.totalAmount}</p>
                    </div>
                    <span className="text-xs text-[#6B7280]">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {!data?.recentOrders?.length ? (
                  <p className="text-sm text-[#6B7280]">No orders yet.</p>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <WidgetSkeleton />
            <WidgetSkeleton />
          </>
        ) : (
          <>
            <div className="card">
              <h2 className="text-lg font-bold text-[#1F2937]">Top Selling Courses</h2>
              <div className="mt-4 space-y-3">
                {(data?.topSellingCourses || []).map((item) => (
                  <div key={item.course?._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{item.course?.title}</p>
                      <p className="text-xs text-[#6B7280]">{item.total} sales - INR {item.revenue}</p>
                    </div>
                  </div>
                ))}
                {!data?.topSellingCourses?.length ? (
                  <p className="text-sm text-[#6B7280]">No sales yet.</p>
                ) : null}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-[#1F2937]">Draft Courses</h2>
              <div className="mt-4 space-y-3">
                {(data?.recentCourses || []).filter((c) => !c.isPublished).map((course) => (
                  <div key={course._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-[#1F2937]">{course.title}</p>
                      <p className="text-xs text-[#6B7280]">Missing publish status</p>
                    </div>
                  </div>
                ))}
                {!data?.recentCourses?.filter((c) => !c.isPublished).length ? (
                  <p className="text-sm text-[#6B7280]">No draft courses.</p>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics









