import { Link } from 'react-router-dom'
import { formatCategory, formatCurrency } from '../utils/formatters'

function RecentTransactions({ transactions }) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No transactions yet -{' '}
        <Link to="/transactions" className="font-medium text-indigo-600 dark:text-indigo-400">
          add your first one
        </Link>
        .
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-900">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <p className="font-medium">{formatCategory(t.category)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.date}
              {t.note && ` · ${t.note}`}
            </p>
          </div>
          <span
            className={`font-medium ${
              t.transactionType === 'INCOME'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {t.transactionType === 'INCOME' ? '+' : '-'}
            {formatCurrency(t.amount)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default RecentTransactions
