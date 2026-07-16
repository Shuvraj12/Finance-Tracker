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
