import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

interface Review {
  id: number
  memberName: string
  rating: number
  text: string
  date: string
  type: string
}

const MOCK_REVIEWS: Review[] = [
  { id: 1, memberName: 'Rahul Desai', rating: 5, text: 'Excellent facilities and very responsive staff. The food quality has improved a lot. Would highly recommend Sunrise Hostel to anyone.', date: 'Feb 28, 2026', type: 'checkout' },
  { id: 2, memberName: 'Kavya Reddy', rating: 4, text: 'Good experience overall. Rooms are clean and well-maintained. The only issue was occasional Wi-Fi slowness in the evenings.', date: 'Feb 15, 2026', type: 'checkout' },
  { id: 3, memberName: 'Amit Sharma', rating: 3, text: 'Decent place to stay but the water supply is sometimes irregular. Staff is helpful when issues are raised. Room cleaning could be more frequent.', date: 'Jan 30, 2026', type: 'checkout' },
  { id: 4, memberName: 'Divya Menon', rating: 5, text: 'Loved staying here! Very clean, safe, and the security is excellent. The mess food is good too. Will miss this place!', date: 'Jan 20, 2026', type: 'checkout' },
  { id: 5, memberName: 'Sanjay Gupta', rating: 2, text: 'Below average experience. Maintenance requests took too long to be resolved. Common areas need better maintenance.', date: 'Jan 10, 2026', type: 'checkout' },
]

const RATING_BREAKDOWN: { stars: number; pct: number }[] = [
  { stars: 5, pct: 40 },
  { stars: 4, pct: 30 },
  { stars: 3, pct: 15 },
  { stars: 2, pct: 10 },
  { stars: 1, pct: 5 },
]

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-purple-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500',
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export default function Reviews() {
  const [filter, setFilter] = useState<number | null>(null)

  const filtered = filter === null ? MOCK_REVIEWS : MOCK_REVIEWS.filter((r) => r.rating === filter)
  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Reviews"
        subtitle="Feedback from residents after checkout"
        count={MOCK_REVIEWS.length}
      />

      {/* Hero rating section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Big rating */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span className="text-6xl font-black text-gray-900 leading-none tracking-tight">{avgRating}</span>
            <StarDisplay rating={Math.round(Number(avgRating))} size={18} />
            <span className="text-xs text-gray-400 font-medium">(28 reviews)</span>
          </div>
          {/* Rating breakdown bars */}
          <div className="flex-1 w-full space-y-2">
            {RATING_BREAKDOWN.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 justify-end">
                  <span className="text-xs font-semibold text-gray-600">{stars}</span>
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-medium w-8">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
            filter === null
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {[5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r === filter ? null : r)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
              filter === r
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Star size={11} className={filter === r ? 'fill-amber-500 text-amber-500' : 'fill-gray-400 text-gray-400'} />
            {r}
          </button>
        ))}
      </div>

      {/* Review cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Star size={20} className="text-gray-300" />
          </div>
          <p className="font-semibold text-gray-400 text-sm">No reviews with this rating</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {getInitials(review.memberName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                    <p className="font-bold text-gray-800 text-sm">{review.memberName}</p>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <StarDisplay rating={review.rating} />
                  <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">{review.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                      <Star size={10} className="fill-indigo-400 text-indigo-400" />
                      Reviewed after checkout
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors">
                      <MessageSquare size={12} />
                      Reply
                    </button>
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
