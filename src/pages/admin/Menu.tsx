import { useState } from 'react'
import { Pencil, Save, X } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const INITIAL_MENU = [
  { day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Curd', dinner: 'Chapati, Paneer Curry, Dal' },
  { day: 'Tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad', dinner: 'Chapati, Mixed Veg, Rice' },
  { day: 'Wednesday', breakfast: 'Paratha, Curd', lunch: 'Rice, Sambar, Papad', dinner: 'Chapati, Egg Curry, Dal' },
  { day: 'Thursday', breakfast: 'Upma, Tea', lunch: 'Rice, Dal, Aloo Sabzi', dinner: 'Chapati, Kadai Chicken, Rice' },
  { day: 'Friday', breakfast: 'Puri, Chhole', lunch: 'Biryani, Raita', dinner: 'Chapati, Fish Curry, Dal' },
  { day: 'Saturday', breakfast: 'Dosa, Sambar', lunch: 'Rice, Dal Makhani, Salad', dinner: 'Fried Rice, Manchurian, Soup' },
  { day: 'Sunday', breakfast: 'Bread, Omelette, Tea', lunch: 'Butter Chicken, Naan, Rice', dinner: 'Chapati, Paneer Butter Masala, Sweet' },
]

export default function AdminMenu() {
  const [menu, setMenu] = useState(INITIAL_MENU)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(INITIAL_MENU)

  function handleSave() {
    // TODO: call updateMenu() API
    setMenu(draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(menu)
    setEditing(false)
  }

  function updateCell(dayIdx: number, field: 'breakfast' | 'lunch' | 'dinner', value: string) {
    setDraft((prev) => prev.map((row, i) => i === dayIdx ? { ...row, [field]: value } : row))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Menu"
        subtitle="Edit the hostel mess schedule"
        action={
          editing ? (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
                <Save size={14} /> Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50">
              <Pencil size={14} /> Edit Menu
            </button>
          )
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium w-28">Day</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Breakfast</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Lunch</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Dinner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(editing ? draft : menu).map((row, i) => (
                <tr key={row.day} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{row.day}</td>
                  {(['breakfast', 'lunch', 'dinner'] as const).map((field) => (
                    <td key={field} className="px-5 py-3.5">
                      {editing ? (
                        <input
                          value={draft[i][field]}
                          onChange={(e) => updateCell(i, field, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : (
                        <span className="text-gray-600">{row[field]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
