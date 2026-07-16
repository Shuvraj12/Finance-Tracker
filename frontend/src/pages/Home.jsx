import { useAuth } from '../hooks/useAuth'

function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user?.name}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You&apos;re logged in and this route is protected by a real JWT. The
          actual dashboard (balance, charts, recent transactions) lands in
          Phase 5 - this is just proof the auth flow works end to end.
        </p>
        <button
          onClick={logout}
          className="mt-6 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default Home
