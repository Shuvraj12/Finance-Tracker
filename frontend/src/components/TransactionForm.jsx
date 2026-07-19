import { useEffect, useState } from 'react'
import { categoriesFor } from '../utils/categories'
import { formatCategory } from '../utils/formatters'

const inputClasses =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

// Maps a transaction from the API (or nothing, for "add" mode) into the
// form's own shape - kept separate from the API response shape so a null
// note, or any future extra field like id/createdAt, can't leak into a
// controlled input's value.
function toFormValues(transaction) {
  if (!transaction) {
    return {
      transactionType: 'EXPENSE',
      category: 'FOOD',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    }
  }
  return {
    transactionType: transaction.transactionType,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    note: transaction.note ?? '',
  }
}

function TransactionForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() => toFormValues(initialValue))

  // Re-sync whenever we switch between "add" and "edit", or between editing
  // different rows.
  useEffect(() => {
    setForm(toFormValues(initialValue))
  }, [initialValue])

  const categories = categoriesFor(form.transactionType)

  const handleTypeChange = (e) => {
    const transactionType = e.target.value
    const nextCategories = categoriesFor(transactionType)
    setForm((f) => ({
      ...f,
      transactionType,
      category: nextCategories.includes(f.category) ? f.category : nextCategories[0],
    }))
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Send exactly the fields the backend's TransactionRequest expects -
    // initialValue may carry extra fields (id, createdAt) that Jackson will
    // reject on an update since TransactionRequest doesn't declare them.
    onSubmit({
      transactionType: form.transactionType,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      note: form.note,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="transactionType">
          Type
        </label>
        <select
          id="transactionType"
          name="transactionType"
          value={form.transactionType}
          onChange={handleTypeChange}
          className={inputClasses}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClasses}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={form.amount}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1" htmlFor="note">
          Note (optional)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          maxLength={500}
          value={form.note}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="sm:col-span-2 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : initialValue ? 'Save changes' : 'Add transaction'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TransactionForm
