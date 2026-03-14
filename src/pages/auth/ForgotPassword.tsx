import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    // TODO: call sendOtp API
    setStep(2)
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    // TODO: call resetPassword API
    setStep(3)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3 shadow-lg">
            <KeyRound size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && 'Enter the OTP and set a new password'}
            {step === 3 && 'Your password has been reset'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Step indicator */}
          <div className="flex">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 transition-all ${s <= step ? 'bg-indigo-500' : 'bg-gray-100'}`}
              />
            ))}
          </div>

          <div className="p-7">
            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
                >
                  Send OTP
                </button>
              </form>
            )}

            {/* Step 2: OTP + new password */}
            {step === 2 && (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    OTP (sent to {email})
                  </label>
                  <input
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-center tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Password Reset Successfully</h3>
                  <p className="text-sm text-gray-500 mt-1">You can now log in with your new password.</p>
                </div>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0f2d4a 0%, #1d6ea8 100%)' }}
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to login */}
        {step !== 3 && (
          <button
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-1.5 mx-auto mt-5 text-xs font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <ArrowLeft size={13} />
            Back to Login
          </button>
        )}
      </div>
    </div>
  )
}
