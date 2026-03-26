import { useGetDailyData } from '@/hooks/analytic.hook'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const Analytics = () => {
  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    end.setDate(end.getDate()+2)
    const toStr = (d) => d.toISOString().split('T')[0]

    return {
      startDate: toStr(start),
      endDate: toStr(end),
    }
  }, [])

  const { data: dailyData, isLoading } = useGetDailyData(startDate, endDate)

  return (
    <div className="page-bg py-8">
      <div className="page-shell space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Analytics</h1>
        <p className="text-[#6B7280] mt-1">Revenue and enrollment trends</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1F2937]">Revenue Trend</h2>
            <p className="text-sm text-[#6B7280]">Last 7 days performance</p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[55vh] flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <div className="h-[55vh]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData || []}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`INR ${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#6C5DD3" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Analytics






