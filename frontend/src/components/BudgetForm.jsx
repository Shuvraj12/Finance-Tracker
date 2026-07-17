import { useEffect, useState } from 'react'

const inputClasses =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

function BudgetForm({ initialAmount, onSubmit, submitting }) {
  const [amount, setAmount] = useState(initialAmount ?? '')

  useEffect(() => {
    setAmount(initialAmount ?? '')
  }, [initialAmount])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(Number(amount))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1" htmlFor="budgetAmount">
          Monthly budget amount
        </label>
        <input
          id="budgetAmount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {submitting ? 'Saving...' : initialAmount ? 'Update budget' : 'Set budget'}
      </button>
    </form>
  )
}

export default BudgetForm
