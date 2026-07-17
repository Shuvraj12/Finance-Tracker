import { useCallback, useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import BudgetSummary from '../components/BudgetSummary'
import { budgetService } from '../services/budgetService'

function Budget() {
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const loadBudget = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await budgetService.get()
      setBudget(data)
    } catch (err) {
      if (err.response?.status === 404) {
        // Not an error - just means nothing has been set for this month yet.
        setBudget(null)
      } else {
        setError('Could not load your budget')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBudget()
  }, [loadBudget])

  const handleSubmit = async (amount) => {
    setSubmitting(true)
    setError(null)
    try {
      const now = new Date()
      const payload = { amount, month: now.getMonth() + 1, year: now.getFullYear() }
      if (budget) {
        await budgetService.update(payload)
      } else {
        await budgetService.create(payload)
      }
      await loadBudget()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your budget')
    } finally {
      setSubmitting(false)
    }
  }

  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Budget</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{monthLabel}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold">
          {budget ? "Update this month's budget" : 'Set a budget for this month'}
        </h2>
        <BudgetForm initialAmount={budget?.amount} onSubmit={handleSubmit} submitting={submitting} />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : budget ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <BudgetSummary budget={budget} />
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No budget set for this month yet - add one above.
        </p>
      )}
    </div>
  )
}

export default Budget
