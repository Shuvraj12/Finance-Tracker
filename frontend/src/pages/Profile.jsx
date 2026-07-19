import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const inputClasses =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    newPassword: '',
    confirmNewPassword: '',
    currentPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setFormError('New passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword,
        // Send undefined (omitted from the JSON body) rather than an empty
        // string when no new password was entered - the backend's @Size
        // validator would otherwise reject "" as too short, even though an
        // empty field here just means "don't change the password."
        newPassword: form.newPassword || undefined,
      })
      setSuccessMessage('Profile updated.')
      setForm((f) => ({ ...f, newPassword: '', confirmNewPassword: '', currentPassword: '' }))
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not update your profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setDeleteError(null)
    setDeleting(true)
    try {
      await deleteAccount({ currentPassword: deletePassword })
      navigate('/login')
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete your account')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your details, change your password, or delete your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <p className="mb-3 text-sm font-medium">Change password (optional)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="newPassword"
              type="password"
              placeholder="New password"
              minLength={8}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className={inputClasses}
            />
            <input
              name="confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              minLength={8}
              autoComplete="new-password"
              value={form.confirmNewPassword}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="currentPassword">
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Required to confirm any change above.
          </p>
        </div>

        {formError && <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>}
        {successMessage && <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">Delete account</h2>
        <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">
          This permanently deletes your account and every transaction and budget attached to it.
          This cannot be undone.
        </p>

        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={handleDelete} className="mt-4 space-y-3">
            <input
              type="password"
              required
              placeholder="Confirm your password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className={inputClasses}
            />
            {deleteError && <p className="text-sm text-red-700 dark:text-red-300">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Permanently delete'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmingDelete(false)
                  setDeletePassword('')
                  setDeleteError(null)
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
