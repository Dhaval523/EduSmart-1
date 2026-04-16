import React, { useMemo, useState } from 'react'
import { Search, Download, RotateCcw, BadgeCheck, Copy } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useAdminOrders } from '@/hooks/order.hook'
import { exportRowsToCsv, formatINR } from '@/utils/report'
import { getAdminOrdersApi } from '@/Api/order.api'

const Orders = () => {
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sort: 'newest',
    page: 1,
    limit: 10
  })

  const [isExporting, setIsExporting] = useState(false)

  const params = useMemo(() => ({
    search: filters.search || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    minAmount: filters.minAmount || undefined,
    maxAmount: filters.maxAmount || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit
  }), [filters])

  const { data, isLoading } = useAdminOrders(params)
  const orders = data?.orders || []
  const summary = data?.summary || {}

  const handleExport = async () => {
    if (!data?.meta?.total) {
      return
    }
    try {
      setIsExporting(true)
      const exportData = await getAdminOrdersApi({
        ...params,
        page: 1,
        limit: data.meta.total
      })

      const rows = (exportData?.orders || []).map((order) => ({
        paymentId: order.paymentId || order._id,
        sessionId: order.stripeSessionId || '-',
        student: order.user?.fullName || 'Unknown',
        email: order.user?.email || '-',
        course: order.course?.title || 'Course',
        category: order.course?.category || 'N/A',
        amount: order.totalAmount,
        status: 'Paid',
        date: new Date(order.createdAt).toLocaleDateString()
      }))

      exportRowsToCsv('enrollments-history', [
        { key: 'paymentId', label: 'Enrollment ID' },
        { key: 'sessionId', label: 'Stripe Session' },
        { key: 'student', label: 'Student' },
        { key: 'email', label: 'Email' },
        { key: 'course', label: 'Course' },
        { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount (INR)' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' }
      ], rows)
    } finally {
      setIsExporting(false)
    }
  }

  const totalPages = data?.meta?.totalPages || 1

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#0f172a]">Enrollment Management</h1>
          <p className="text-[#51607b]">Monitor enrollments, track history, and export records instantly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0ea5a4] text-white flex items-center justify-center">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Total Enrollments</p>
              <p className="text-2xl font-black text-[#0f172a]">{summary.totalOrders ?? 0}</p>
            </div>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Total Revenue</p>
            <p className="text-2xl font-black text-[#0f172a]">{formatINR(summary.totalRevenue || 0)}</p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Avg Enrollment Value</p>
            <p className="text-2xl font-black text-[#0f172a]">{formatINR(summary.avgOrderValue || 0)}</p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Showing</p>
            <p className="text-2xl font-black text-[#0f172a]">{data?.meta?.total || 0} enrollments</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  placeholder="Search student, course, enrollment, session"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full md:w-72"
                />
              </div>

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                className="border border-gray-200 rounded-xl text-sm px-3 py-2"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                className="border border-gray-200 rounded-xl text-sm px-3 py-2"
              />

              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value, page: 1 })}
                placeholder="Min amount"
                className="border border-gray-200 rounded-xl text-sm px-3 py-2 w-28"
              />

              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value, page: 1 })}
                placeholder="Max amount"
                className="border border-gray-200 rounded-xl text-sm px-3 py-2 w-28"
              />

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                className="border border-gray-200 rounded-xl text-sm px-3 py-2"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="amount_desc">Amount high-low</option>
                <option value="amount_asc">Amount low-high</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({
                  search: '',
                  startDate: '',
                  endDate: '',
                  minAmount: '',
                  maxAmount: '',
                  sort: 'newest',
                  page: 1,
                  limit: filters.limit
                })}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting || !data?.meta?.total}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
              >
                {isExporting ? <Spinner /> : <Download className="w-4 h-4" />} Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-[#f5f7fb] text-[#0f172a]">
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold">Enrollment</th>
                  <th className="text-left px-4 py-4 font-semibold">Student</th>
                  <th className="text-left px-4 py-4 font-semibold">Course</th>
                  <th className="text-left px-4 py-4 font-semibold">Amount</th>
                  <th className="text-left px-4 py-4 font-semibold">Status</th>
                  <th className="text-left px-4 py-4 font-semibold">Date</th>
                  <th className="text-left px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="p-8" colSpan={7}>
                      <div className="flex justify-center">
                        <Spinner className="size-5" />
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-center text-[#51607b]" colSpan={7}>
                      No enrollments found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-200 hover:bg-[#f5f7fb]/80">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-[#0f172a]">{order.paymentId ? order.paymentId : `#${order._id?.slice(-8)}`}</p>
                          <p className="text-xs text-[#51607b] truncate max-w-[200px]">
                            {order.stripeSessionId || 'Stripe session pending'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="min-w-0">
                          <p className="font-medium text-[#0f172a] truncate">
                            {order.user?.fullName || 'Unknown student'}
                          </p>
                          <p className="text-xs text-[#51607b] truncate">
                            {order.user?.email || 'No email'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="min-w-0">
                          <p className="font-medium text-[#0f172a] truncate">
                            {order.course?.title || 'Course'}
                          </p>
                          <p className="text-xs text-[#51607b] truncate">
                            {order.course?.category || 'Uncategorized'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap font-semibold text-[#0f172a]">
                        {formatINR(order.totalAmount || 0)}
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-[#E7F8F0] text-[#15803D]">
                          Paid
                        </span>
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap text-[#51607b]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-5">
                        <button
                          onClick={() => navigator.clipboard.writeText(order.paymentId || order._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-[#0f172a] hover:bg-gray-100 transition"
                        >
                          <Copy className="w-3 h-3" /> Copy ID
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-[#51607b]">
              Page {data?.meta?.page || 1} of {totalPages} · {data?.meta?.total || 0} enrollments
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value), page: 1 })}
                className="border border-gray-200 rounded-lg text-sm px-2 py-1"
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
      </div>
    </div>
  )
}

export default Orders

