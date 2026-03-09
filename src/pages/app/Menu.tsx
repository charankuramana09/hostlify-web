import PageHeader from '../../components/ui/PageHeader'

const WEEKLY_MENU = [
  { day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Curd', dinner: 'Chapati, Paneer Curry, Dal' },
  { day: 'Tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad', dinner: 'Chapati, Mixed Veg, Rice' },
  { day: 'Wednesday', breakfast: 'Paratha, Curd', lunch: 'Rice, Sambar, Papad', dinner: 'Chapati, Egg Curry, Dal' },
  { day: 'Thursday', breakfast: 'Upma, Tea', lunch: 'Rice, Dal, Aloo Sabzi', dinner: 'Chapati, Kadai Chicken, Rice' },
  { day: 'Friday', breakfast: 'Puri, Chhole', lunch: 'Biryani, Raita', dinner: 'Chapati, Fish Curry, Dal' },
  { day: 'Saturday', breakfast: 'Dosa, Sambar', lunch: 'Rice, Dal Makhani, Salad', dinner: 'Fried Rice, Manchurian, Soup' },
  { day: 'Sunday', breakfast: 'Bread, Omelette, Tea', lunch: 'Special Meal – Butter Chicken, Naan', dinner: 'Chapati, Paneer Butter Masala, Sweet' },
]

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function Menu() {
  return (
    <div className="space-y-6">
      <PageHeader title="Weekly Menu" subtitle="Hostel mess schedule for this week" />

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
              {WEEKLY_MENU.map((row) => (
                <tr
                  key={row.day}
                  className={row.day === TODAY ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${row.day === TODAY ? 'text-indigo-700' : 'text-gray-800'}`}>
                      {row.day}
                    </span>
                    {row.day === TODAY && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{row.breakfast}</td>
                  <td className="px-5 py-4 text-gray-600">{row.lunch}</td>
                  <td className="px-5 py-4 text-gray-600">{row.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
