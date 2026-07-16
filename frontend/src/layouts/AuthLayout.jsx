function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-center">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
