const CURRENCY = 'INR'
const LOCALE = 'en-IN'

export function formatCurrency(amount) {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(amount)
}

export function formatCategory(category) {
  return category.charAt(0) + category.slice(1).toLowerCase()
}

// `new Date('2026-07-01')` parses as UTC midnight, which displays as
// "Jun 30" in any timezone behind UTC - splitting the parts out and using
// the local-time constructor avoids that off-by-one.
export function formatDate(isoDateString) {
  const [year, month, day] = isoDateString.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
