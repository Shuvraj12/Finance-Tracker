import { useCallback, useEffect, useRef, useState } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import { transactionService } from '../services/transactionService'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const formRef = useRef(null)

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch {
      setError('Could not load transactions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  // The form sits above a table that can run well past the fold. Without
  // this, clicking Edit on a row further down silently updates a form
  // that's scrolled out of view - which looks exactly like the button
  // doing nothing.
  useEffect(() => {
    if (editingTransaction) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingTransaction])

  const handleSubmit = async (formValues) => {
    setSubmitting(true)
    setError(null)
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.id, formValues)
      } else {
        await transactionService.create(formValues)
      }
      setEditingTransaction(null)
      await loadTransactions()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    setError(null)
    try {
      await transactionService.remove(id)
      await loadTransactions()
    } catch {
      setError('Could not delete the transaction')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add, edit, and remove your income and expenses.
        </p>
      </div>

      <div
        ref={formRef}
        className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 className="mb-4 text-sm font-semibold">
          {editingTransaction ? 'Edit transaction' : 'Add a transaction'}
        </h2>
        <TransactionForm
          initialValue={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={editingTransaction ? () => setEditingTransaction(null) : undefined}
          submitting={submitting}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

export default Transactions
