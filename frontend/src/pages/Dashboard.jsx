import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ExpensePieChart from '../components/ExpensePieChart'
import MonthlySpendingChart from '../components/MonthlySpendingChart'
import RecentTransactions from '../components/RecentTransactions'
import SummaryCard from '../components/SummaryCard'
import { useAuth } from '../hooks/useAuth'
import { dashboardService } from '../services/dashboardService'
import { formatCurrency } from '../utils/formatters'

function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dashboardService.get()
      setDashboard(data)
    } catch {
      setError('Could not load your dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) {
    return <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
  }

  if (error || !dashboard) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error || 'Something went wrong'}</p>
  }

  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    savings,
    budget,
    recentTransactions,
    expenseByCategory,
    monthlyTrend,
  } = dashboard

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Here&apos;s where things stand.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard
          label="Total balance"
          sublabel="All time"
          value={formatCurrency(totalBalance)}
          tone={totalBalance >= 0 ? 'positive' : 'negative'}
        />
        <SummaryCard label="Total income" sublabel="All time" value={formatCurrency(totalIncome)} tone="positive" />
        <SummaryCard
          label="Total expenses"
          sublabel="All time"
          value={formatCurrency(totalExpenses)}
          tone="negative"
        />
        <SummaryCard
          label="Savings"
          sublabel="This month"
          value={formatCurrency(savings)}
          tone={savings >= 0 ? 'positive' : 'negative'}
        />
        {budget ? (
          <SummaryCard
            label="Budget remaining"
            sublabel="This month"
            value={formatCurrency(budget.remaining)}
            tone={budget.exceeded ? 'negative' : 'default'}
          />
        ) : (
          <Link
            to="/budget"
            className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            Set a budget for this month
          </Link>
        )}
      </div>

      {budget?.exceeded && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          You&apos;ve gone over your budget this month by {formatCurrency(Math.abs(budget.remaining))}.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-semibold">Expenses by category</h2>
          <ExpensePieChart data={expenseByCategory} />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-semibold">Income vs expenses</h2>
          <MonthlySpendingChart data={monthlyTrend} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent transactions</h2>
          <Link to="/transactions" className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            View all
          </Link>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}

export default Dashboard
