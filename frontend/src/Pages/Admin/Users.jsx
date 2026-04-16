import React, { useMemo, useState } from 'react'
import { Search, Download, RotateCcw, Shield, UserRound, Copy } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useAdminUsers } from '@/hooks/User.hook'
import { exportRowsToCsv, formatINR } from '@/utils/report'
import { getAdminUsersApi } from '@/Api/user.api'

const Users = () => {
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    startDate: '',
    endDate: '',
    sort: 'newest',
    page: 1,
    limit: 10
  })

  const [isExporting, setIsExporting] = useState(false)

  const params = useMemo(() => ({
    search: filters.search || undefined,
    role: filters.role || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit
  }), [filters])

  const { data, isLoading } = useAdminUsers(params)
  const users = data?.users || []
  const summary = data?.summary || {}

  const handleExport = async () => {
    if (!data?.meta?.total) {
      return
    }
    try {
      setIsExporting(true)
      const exportData = await getAdminUsersApi({
        ...params,
        page: 1,
        limit: data.meta.total
      })

      const rows = (exportData?.users || []).map((user) => ({
        userId: user._id,
        name: user.fullName,
        email: user.email,
        role: user.admin ? 'Admin' : 'Student',
        enrollments: user.orderCount ?? 0,
        spent: user.totalSpent ?? 0,
        purchased: user.purchasedCount ?? 0,
        joined: new Date(user.createdAt).toLocaleDateString()
      }))

      exportRowsToCsv('users-history', [
        { key: 'userId', label: 'User ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'enrollments', label: 'Enrollments' },
        { key: 'spent', label: 'Total Spent (INR)' },
        { key: 'purchased', label: 'Purchased Courses' },
        { key: 'joined', label: 'Joined' }
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
          <h1 className="text-3xl font-bold text-[#0f172a]">User Management</h1>
          <p className="text-[#51607b]">Track learner activity, admin access, and lifetime value.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0ea5a4] text-white flex items-center justify-center">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Total Users</p>
              <p className="text-2xl font-black text-[#0f172a]">{summary.totalUsers ?? 0}</p>
            </div>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Admins</p>
            <p className="text-2xl font-black text-[#0f172a]">{summary.adminUsers ?? 0}</p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Students</p>
            <p className="text-2xl font-black text-[#0f172a]">{summary.studentUsers ?? 0}</p>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-[#51607b] uppercase tracking-[0.18em]">Total Revenue</p>
            <p className="text-2xl font-black text-[#0f172a]">{formatINR(summary.totalRevenue || 0)}</p>
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
                  placeholder="Search name or email"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full md:w-72"
                />
              </div>

              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                className="border border-gray-200 rounded-xl text-sm px-3 py-2"
              >
                <option value="all">All roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
              </select>

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

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                className="border border-gray-200 rounded-xl text-sm px-3 py-2"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="orders_desc">Most enrollments</option>
                <option value="spent_desc">Highest spend</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-[#51607b]">Total enrollments: {summary.totalOrders ?? 0}</div>

              <button
                onClick={() => setFilters({
                  search: '',
                  role: 'all',
                  startDate: '',
                  endDate: '',
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
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-4 py-4 font-semibold">Role</th>
                  <th className="text-left px-4 py-4 font-semibold">Enrollments</th>
                  <th className="text-left px-4 py-4 font-semibold">Spent</th>
                  <th className="text-left px-4 py-4 font-semibold">Purchased</th>
                  <th className="text-left px-4 py-4 font-semibold">Joined</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td className="px-6 py-10 text-center text-[#51607b]" colSpan={7}>
                      No users found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-t border-gray-200 hover:bg-[#f5f7fb]/80">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-[#eef2f8] overflow-hidden flex items-center justify-center text-xs font-semibold text-[#51607b]">
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt={user.fullName} className="h-full w-full object-cover" />
                            ) : (
                              (user.fullName || 'U').slice(0, 1)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0f172a] truncate">{user.fullName || 'Unknown'}</p>
                            <p className="text-xs text-[#51607b] truncate">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${user.admin ? 'bg-[#e7f5f4] text-[#0ea5a4]' : 'bg-[#eef2f8] text-[#51607b]'}`}>
                          {user.admin ? <Shield className="w-3 h-3" /> : null}
                          {user.admin ? 'Admin' : 'Student'}
                        </span>
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap text-[#0f172a]">{user.orderCount ?? 0}</td>
                      <td className="px-4 py-5 whitespace-nowrap font-semibold text-[#0f172a]">{formatINR(user.totalSpent || 0)}</td>
                      <td className="px-4 py-5 whitespace-nowrap text-[#0f172a]">{user.purchasedCount ?? 0}</td>
                      <td className="px-4 py-5 whitespace-nowrap text-[#51607b]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-5">
                        <button
                          onClick={() => navigator.clipboard.writeText(user._id)}
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
              Page {data?.meta?.page || 1} of {totalPages} · {data?.meta?.total || 0} users
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

export default Users

