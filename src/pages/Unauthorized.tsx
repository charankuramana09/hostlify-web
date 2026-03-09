import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Access Denied</h2>
        <p className="mt-2 text-gray-500">You do not have permission to view this page.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
