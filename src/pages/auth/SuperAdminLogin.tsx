import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import LoginForm from '../../components/auth/LoginForm'
import { loginSuperAdmin } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { STRINGS } from '../../constants/strings'

export default function SuperAdminLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginSuperAdmin({ email, password }),
    onSuccess: (response) => {
      const { accessToken, refreshToken, role, subRole, email } = response.data
      setAuth({ accessToken, refreshToken, role, subRole, email, hostelIds: [] })
      navigate('/super-admin/dashboard')
    },
  })

  const errorMsg = error
    ? axios.isAxiosError(error)
      ? (error.response?.data?.message ?? 'Login failed. Please try again.')
      : (error as Error).message
    : null

  return (
    <LoginForm
      portalLabel={STRINGS.auth.superAdminPortal}
      onSubmit={(email, password) => mutate({ email, password })}
      isLoading={isPending}
      error={errorMsg}
      otherPortals={[
        { label: STRINGS.auth.hostellerPortal, to: '/auth/login' },
        { label: STRINGS.auth.staffPortal, to: '/auth/staff/login' },
      ]}
    />
  )
}
