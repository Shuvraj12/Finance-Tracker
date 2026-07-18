import { useCallback, useEffect, useState } from 'react'
import ExpensePieChart from '../components/ExpensePieChart'
import MonthlySpendingChart from '../components/MonthlySpendingChart'
import PeriodSelector from '../components/PeriodSelector'
import SummaryCard from '../components/SummaryCard'
import { reportService } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/formatters'

function Reports() {
  const [period, setPeriod] = useState('MONTH')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadReport = useCallback(async (selectedPeriod) => {
    setLoading(true)
    setError(null)
    try {
      const data = await reportService.get(selectedPeriod)
      setReport(data)
    } catch {
      setError('Could not load your report')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReport(period)
  }, [period, loadReport])

  const net = report ? report.totalIncome - report.totalExpenses : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {report ? `${formatDate(report.startDate)} – ${formatDate(report.endDate)}` : 'Loading...'}
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        report && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard label="Income" value={formatCurrency(report.totalIncome)} tone="positive" />
              <SummaryCard label="Expenses" value={formatCurrency(report.totalExpenses)} tone="negative" />
              <SummaryCard
                label="Net"
                value={formatCurrency(net)}
                tone={net >= 0 ? 'positive' : 'negative'}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-sm font-semibold">Category distribution</h2>
                <ExpensePieChart data={report.categoryDistribution} />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-4 text-sm font-semibold">Monthly trend (last 12 months)</h2>
                <MonthlySpendingChart data={report.monthlyTrend} />
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}

export default Reports
