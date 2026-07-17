// Mirrors the backend's Category enum (see entity/Category.java) - keep these
// two in sync if categories ever change there.
export const EXPENSE_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'MEDICAL',
  'RENT',
  'OTHERS',
]

export const INCOME_CATEGORIES = ['SALARY', 'FREELANCING', 'INVESTMENTS', 'BONUS', 'OTHERS']

export function categoriesFor(transactionType) {
  return transactionType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

// One fixed color per category so the same category always reads the same
// way on a chart - Dashboard's pie chart today, Reports' category
// distribution later.
export const CATEGORY_COLORS = {
  FOOD: '#6366f1',
  TRANSPORT: '#8b5cf6',
  SHOPPING: '#3b82f6',
  BILLS: '#14b8a6',
  ENTERTAINMENT: '#f59e0b',
  MEDICAL: '#f43f5e',
  RENT: '#06b6d4',
  SALARY: '#22c55e',
  FREELANCING: '#10b981',
  INVESTMENTS: '#059669',
  BONUS: '#16a34a',
  OTHERS: '#94a3b8',
}
