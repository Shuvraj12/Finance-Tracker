import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'

function DashboardLayout() {
  const { logout } = useAuth()

  const linkClasses = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold tracking-tight">Finance Tracker</span>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={linkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={linkClasses}>
              Transactions
            </NavLink>
            <NavLink to="/budget" className={linkClasses}>
              Budget
            </NavLink>
            <NavLink to="/reports" className={linkClasses}>
              Reports
            </NavLink>
            <NavLink to="/profile" className={linkClasses}>
              Profile
            </NavLink>
            <span className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
            <ThemeToggle />
            <button
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
