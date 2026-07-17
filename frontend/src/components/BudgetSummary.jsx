import { formatCurrency } from '../utils/formatters'

function BudgetSummary({ budget }) {
  const { amount, spent, remaining, exceeded } = budget
  const percentUsed = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0

  return (
    <div className="space-y-4">
      {exceeded && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          You&apos;ve gone over budget this month by {formatCurrency(Math.abs(remaining))}.
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
          <p className="mt-1 text-lg font-semibold">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
          <p className="mt-1 text-lg font-semibold">{formatCurrency(spent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              remaining < 0 ? 'text-red-600 dark:text-red-400' : ''
            }`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full ${exceeded ? 'bg-red-500' : 'bg-indigo-600'}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {percentUsed.toFixed(0)}% of budget used
        </p>
      </div>
    </div>
  )
}

export default BudgetSummary
