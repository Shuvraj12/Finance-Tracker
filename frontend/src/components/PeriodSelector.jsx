const PERIODS = [
  { value: 'TODAY', label: 'Today' },
  { value: 'WEEK', label: 'Week' },
  { value: 'MONTH', label: 'Month' },
  { value: 'YEAR', label: 'Year' },
]

function PeriodSelector({ value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 dark:border-gray-800">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === p.value
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default PeriodSelector
