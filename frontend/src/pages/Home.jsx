import { useAuth } from '../hooks/useAuth'

function Home() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        You&apos;re logged in and this route is protected by a real JWT. The
        actual dashboard (balance, charts, recent transactions) lands in
        Phase 5 - for now, head to Transactions to try the full CRUD flow.
      </p>
    </div>
  )
}

export default Home
