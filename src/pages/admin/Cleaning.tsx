import { useState } from 'react'
import { SprayCan, Clock, CheckCircle2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

interface CleaningRequest {
  id: number
  memberName: string
  room: string
  requestedDate: string
  preferredSlot: string
  notes: string
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED'
}

const MOCK_CLEANING: CleaningRequest[] = [
  { id: 1, memberName: 'Arjun Sharma', room: 'A-101', requestedDate: 'Mar 14, 2026', preferredSlot: '10:00 AM – 12:00 PM', notes: 'Deep clean required, bathroom especially', status: 'PENDING' },
  { id: 2, memberName: 'Priya Singh', room: 'A-102', requestedDate: 'Mar 13, 2026', preferredSlot: '2:00 PM – 4:00 PM', notes: 'Regular cleaning only', status: 'SCHEDULED' },
  { id: 3, memberName: 'Ravi Kumar', room: 'B-201', requestedDate: 'Mar 12, 2026', preferredSlot: '9:00 AM – 11:00 AM', notes: 'Window cleaning needed', status: 'COMPLETED' },
  { id: 4, memberName: 'Sneha Patel', room: 'B-202', requestedDate: 'Mar 11, 2026', preferredSlot: '11:00 AM – 1:00 PM', notes: 'Furniture dusting and mopping', status: 'PENDING' },
  { id: 5, memberName: 'Ananya Iyer', room: 'C-302', requestedDate: 'Mar 10, 2026', preferredSlot: '3:00 PM – 5:00 PM', notes: 'Full room cleaning', status: 'COMPLETED' },
]

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

type TabType = 'PENDING' | 'SCHEDULED' | 'COMPLETED'

export default function Cleaning() {
  const [requests, setRequests] = useState<CleaningRequest[]>(MOCK_CLEANING)
  const [activeTab, setActiveTab] = useState<TabType>('PENDING')

  const pending = requests.filter((r) => r.status === 'PENDING')
  const scheduled = requests.filter((r) => r.status === 'SCHEDULED')
  const completed = requests.filter((r) => r.status === 'COMPLETED')

  const tabItems: { key: TabType; label: string; count: number }[] = [
    { key: 'PENDING', label: 'Pending', count: pending.length },
    { key: 'SCHEDULED', label: 'Scheduled', count: scheduled.length },
    { key: 'COMPLETED', label: 'Completed', count: completed.length },
  ]

  const displayed = requests.filter((r) => r.status === activeTab)

  function handleSchedule(id: number) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'SCHEDULED' as const } : r))
  }

  function handleComplete(id: number) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'COMPLETED' as const } : r))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cleaning Requests"
        subtitle={`${requests.length} total requests`}
        count={displayed.length}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pending"
          value={pending.length}
          sub="Awaiting schedule"
          icon={<Clock size={20} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Scheduled"
          value={scheduled.length}
          sub="Cleaning assigned"
          icon={<SprayCan size={20} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          sub="Cleaned successfully"
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Request cards */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <SprayCan size={20} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-400 text-sm">No {activeTab.toLowerCase()} requests</p>
          <p className="text-xs text-gray-400">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((req, i) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {getInitials(req.memberName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{req.memberName}</p>
                      <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg tracking-wider">
                        {req.room}
                      </span>
                    </div>
                    <Badge status={req.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    <span className="text-xs text-gray-400">Requested: <span className="font-medium text-gray-600">{req.requestedDate}</span></span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      <Clock size={11} />
                      {req.preferredSlot}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{req.notes}</p>
                  <div className="mt-3">
                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => handleSchedule(req.id)}
                        className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}
                      >
                        Schedule Cleaning
                      </button>
                    )}
                    {req.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleComplete(req.id)}
                        className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}
                      >
                        Mark Complete
                      </button>
                    )}
                    {req.status === 'COMPLETED' && (
                      <span className="px-4 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
