import { formatCategory, formatCurrency } from '../utils/formatters'

function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No transactions yet - add your first one above.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Note</th>
            <th className="py-2 pr-4 text-right font-medium">Amount</th>
            <th className="py-2 pr-0 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="whitespace-nowrap py-2 pr-4">{t.date}</td>
              <td className="py-2 pr-4">{formatCategory(t.category)}</td>
              <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">{t.note || '—'}</td>
              <td
                className={`whitespace-nowrap py-2 pr-4 text-right font-medium ${
                  t.transactionType === 'INCOME'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {t.transactionType === 'INCOME' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              <td className="whitespace-nowrap py-2 pr-0 text-right">
                <button
                  onClick={() => onEdit(t)}
                  className="mr-3 font-medium text-indigo-600 dark:text-indigo-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="font-medium text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionList
