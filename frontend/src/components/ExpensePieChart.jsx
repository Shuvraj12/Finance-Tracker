import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_COLORS } from '../utils/categories'
import { formatCategory, formatCurrency } from '../utils/formatters'

function ExpensePieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        No expenses recorded this month yet.
      </p>
    )
  }

  const total = data.reduce((sum, d) => sum + d.total, 0)
  const chartData = data
    .map((d) => ({
      name: formatCategory(d.category),
      value: d.total,
      color: CATEGORY_COLORS[d.category] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={200} className="sm:max-w-[200px]">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="w-full flex-1 space-y-2">
        {chartData.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExpensePieChart
