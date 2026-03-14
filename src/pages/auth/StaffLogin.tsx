import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import LoginForm from '../../components/auth/LoginForm'
import { loginStaff } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { STRINGS } from '../../constants/strings'

export default function StaffLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginStaff({ email, password }),
    onSuccess: (response) => {
      const { accessToken, refreshToken, role } = response.data
      setAuth({ accessToken, refreshToken, role })
      navigate('/admin/dashboard')
    },
  })

  const errorMsg = error instanceof Error ? error.message : error ? 'Login failed. Please try again.' : null

  function handleDemoAccess() {
    setAuth({ accessToken: 'demo-token', refreshToken: 'demo-refresh', role: 'HOSTEL_STAFF' })
    navigate('/admin/dashboard')
  }

  return (
    <LoginForm
      portalLabel={STRINGS.auth.staffPortal}
      onSubmit={(email, password) => mutate({ email, password })}
      isLoading={isPending}
      error={errorMsg}
      onDemoAccess={handleDemoAccess}
      otherPortals={[
        { label: STRINGS.auth.hostellerPortal, to: '/auth/login' },
        { label: STRINGS.auth.superAdminPortal, to: '/auth/super-admin/login' },
      ]}
    />
  )
}
