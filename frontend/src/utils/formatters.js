const CURRENCY = 'INR'
const LOCALE = 'en-IN'

export function formatCurrency(amount) {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(amount)
}

export function formatCategory(category) {
  return category.charAt(0) + category.slice(1).toLowerCase()
}
