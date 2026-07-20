import { createContext, useLayoutEffect, useState } from 'react'

const THEME_KEY = 'finance_tracker_theme'

export const ThemeContext = createContext(null)

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  // No explicit choice saved yet - fall back to the OS/browser preference.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // useLayoutEffect (not useEffect) so the class is applied before the
  // browser paints, rather than one frame after - relevant on toggle, and
  // index.html also sets this same class synchronously before React even
  // mounts, so there's no flash of the wrong theme on first load either.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
