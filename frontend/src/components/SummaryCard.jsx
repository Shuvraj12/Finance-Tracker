const TONE_CLASSES = {
  default: '',
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
}

function SummaryCard({ label, value, sublabel, tone = 'default' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sublabel}</p>}
    </div>
  )
}

export default SummaryCard
