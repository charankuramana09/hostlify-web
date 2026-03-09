import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import LoginForm from '../../components/auth/LoginForm'
import { loginHosteller } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { STRINGS } from '../../constants/strings'

export default function HostellerLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginHosteller({ email, password }),
    onSuccess: (response) => {
      const { accessToken, refreshToken, role } = response.data
      setAuth({ accessToken, refreshToken, role })
      navigate('/app/dashboard')
    },
  })

  const errorMsg = error instanceof Error ? error.message : error ? 'Login failed. Please try again.' : null

  return (
    <LoginForm
      portalLabel={STRINGS.auth.hostellerPortal}
      onSubmit={(email, password) => mutate({ email, password })}
      isLoading={isPending}
      error={errorMsg}
      signupLink={{ label: STRINGS.auth.signUp, to: '/auth/signup' }}
      otherPortals={[
        { label: STRINGS.auth.staffPortal, to: '/auth/staff/login' },
        { label: STRINGS.auth.superAdminPortal, to: '/auth/super-admin/login' },
      ]}
    />
  )
}
