import eventsData from '../data/events.json'

type Event = {
  id: number
  title: string
  description: string
  startTime: string
  day?: string
  notes?: string | null
}

function parseTime(timeStr: string): number {
  const parts = timeStr.split(' ')
  const period = parts[1]
  const [hoursStr, minutesStr] = parts[0].split(':')
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

export default function SchedulePage() {
  const events = eventsData.events as Event[]
  const { name, subtitle } = eventsData.conference

  const grouped = events.reduce<Record<string, Event[]>>((acc, event) => {
    if (!acc[event.startTime]) acc[event.startTime] = []
    acc[event.startTime].push(event)
    return acc
  }, {})

  const sortedTimes = Object.keys(grouped).sort(
    (a, b) => parseTime(a) - parseTime(b)
  )

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            {name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Date label */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-10">
          Saturday, March 7
        </p>

        {/* Event List */}
        <div className="space-y-10">
          {sortedTimes.map((time) => (
            <section key={time}>
              {/* Time Header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {time}
                </span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>

              {/* Events at this time */}
              <div className="space-y-7">
                {grouped[time].map((event) => (
                  <article key={event.id} className="pl-1">
                    <h2 className="text-base font-semibold text-indigo-400 mb-1.5 leading-snug">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                    {event.notes && (
                      <p className="text-sm text-gray-500 italic mt-2">
                        — {event.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <p className="text-xs text-gray-600 text-center">
            {name} &mdash; Schedule subject to change
          </p>
        </div>
      </footer>
    </main>
  )
}
