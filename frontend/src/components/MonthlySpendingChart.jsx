import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../utils/formatters'

function MonthlySpendingChart({ data }) {
  if (!data || data.every((d) => d.income === 0 && d.expenses === 0)) {
    return (
      <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Not enough history yet to show a trend.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-600" /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-600" /> Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-800" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlySpendingChart
