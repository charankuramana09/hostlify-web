import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STRINGS } from '../../constants/strings'
import Button from '../common/Button'
import Input from '../common/Input'

interface LoginFormProps {
  portalLabel: string
  onSubmit: (email: string, password: string) => void
  isLoading: boolean
  error?: string | null
  otherPortals?: { label: string; to: string }[]
  signupLink?: { label: string; to: string }
  onDemoAccess?: () => void
}

export default function LoginForm({
  portalLabel,
  onSubmit,
  isLoading,
  error,
  otherPortals,
  signupLink,
  onDemoAccess,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <div className="login-page">
      {/* Background decoration from wireframe */}
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(58,174,232,0.1)_0%,transparent_70%)]" />
      <div className="absolute top-10 left-10 hidden md:block">
        <div className="text-2xl font-bold text-white tracking-tight">{STRINGS.common.appName}</div>
        <div className="text-xs text-white/40 mt-0.5">{STRINGS.common.smartManagement}</div>
      </div>

      <div className="login-card">
        <div className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
          {STRINGS.common.appName}
        </div>
        <div className="text-[13px] text-gray-400 mb-7">
          {portalLabel} · {STRINGS.auth.signIn}
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={STRINGS.auth.email}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={STRINGS.auth.emailPlaceholder}
          />

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="form-label mb-0">{STRINGS.auth.password}</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-brand-600 hover:underline font-normal"
              >
                {STRINGS.auth.forgotPassword}
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={STRINGS.auth.passwordPlaceholder}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2"
          >
            {STRINGS.auth.signIn}
          </Button>
        </form>

        {onDemoAccess && (
          <div className="mt-4">
            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium shrink-0">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <button
              type="button"
              onClick={onDemoAccess}
              className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
            >
              ⚡ Demo Access — skip login
            </button>
          </div>
        )}

        {signupLink && (
          <div className="mt-5 text-center text-[13px] text-gray-400">
            {STRINGS.auth.newResident}{' '}
            <Link to={signupLink.to} className="text-brand-600 font-medium hover:underline">
              {signupLink.label}
            </Link>
          </div>
        )}

        {otherPortals && otherPortals.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-400">
              {otherPortals[0].label.includes('Staff') ? STRINGS.auth.isStaff : STRINGS.auth.isHosteller}{' '}
            </span>
            <Link to={otherPortals[0].to} className="text-xs text-brand-600 font-medium hover:underline">
              {otherPortals[0].label} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
