import { useId } from "react";
import { formatWeekday } from "../../shared/time";

const historicalFill =
  "repeating-linear-gradient(135deg, var(--color-bar) 0 7px, var(--color-bar-hatch) 7px 9px)";

type Day = { day: string; minutes: number; isToday: boolean };

/** The last seven days of tracked time, today highlighted. goalHours 0 hides the goal line. */
export function HoursTracked({ days, goalHours }: { days: Day[]; goalHours: number }) {
  const headingId = useId();
  const week = days.map((item) => ({ ...item, label: formatWeekday(item.day) }));

  // Divide by the days with logged time to get the average for a day worked.
  const workedDays = week.filter(({ minutes }) => minutes > 0).length;
  const totalMinutes = week.reduce((sum, { minutes }) => sum + minutes, 0);
  const averageHours = workedDays ? totalMinutes / workedDays / 60 : 0;

  // Round the axis up to five equal steps so it includes the goal and the tallest bar.
  const peakHours = Math.max(goalHours, ...week.map(({ minutes }) => minutes / 60));
  const tickStep = Math.max(2, Math.ceil(peakHours / 5));
  const maxHours = tickStep * 5;
  const ticks = Array.from({ length: 6 }, (_, index) => (5 - index) * tickStep);

  return (
    <section
      aria-labelledby={headingId}
      className="min-w-0 rounded-lg border border-border bg-surface p-4 md:p-6"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={headingId} className="text-headline">
          Hours tracked
        </h2>

        <div className="flex items-center gap-3 text-label text-text-secondary">
          {goalHours > 0 && (
            <span className="inline-flex items-center gap-2 border-r border-border pr-3">
              <span
                aria-hidden="true"
                className="w-5 border-t-2 border-dashed border-overdue"
              />
              {goalHours} h goal
            </span>
          )}

          <p>
            <strong className="text-stat text-text">
              {averageHours.toFixed(1)}
            </strong>
            {" h a day worked"}
          </p>
        </div>
      </header>

      {/* Ticks, the goal, and bars share one percentage scale measured from the baseline. */}
      <div
        aria-hidden="true"
        className="mt-8 grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 gap-y-3 md:gap-x-3"
      >
        <div className="relative h-44 md:h-52">
          {ticks.map((hours) => (
            <span
              key={hours}
              className="absolute right-0 translate-y-1/2 text-micro text-text-muted"
              style={{ bottom: `${(hours / maxHours) * 100}%` }}
            >
              {hours}
            </span>
          ))}
        </div>

        <div className="relative grid h-44 grid-cols-7 gap-1 md:h-52 md:gap-3">
          {goalHours > 0 && (
            <div
              className="absolute inset-x-0 border-t-2 border-dashed border-overdue"
              style={{ bottom: `${(goalHours / maxHours) * 100}%` }}
            />
          )}

          {week.map(({ day, minutes, isToday }) => (
            <div key={day} className="relative min-w-0">
              {/* A minimum bar height leaves a baseline marker on days with zero time. */}
              <div
                className={`absolute bottom-0 left-1/2 min-h-1.5 w-4/5 max-w-14 -translate-x-1/2 rounded-b-xs rounded-t-md ${
                  isToday ? "bg-amber" : ""
                }`}
                style={{
                  height: `${(minutes / 60 / maxHours) * 100}%`,
                  backgroundImage: isToday ? undefined : historicalFill,
                }}
              >
                <span
                  className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-pill px-1.5 py-0.5 text-micro md:px-2 ${
                    isToday
                      ? "bg-amber text-on-amber"
                      : "bg-raised text-text shadow-card"
                  }`}
                >
                  {minutes > 0 ? `${(minutes / 60).toFixed(1)} h` : "–"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="col-start-2 grid grid-cols-7 gap-1 text-center text-micro md:gap-3 md:text-label">
          {week.map(({ day, label, isToday }) => (
            <span
              key={day}
              className={isToday ? "font-bold text-amber" : "text-text-muted"}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* The table exposes the data to screen readers while the visual chart is hidden from them. */}
      <div className="sr-only">
        <table>
          <caption>Hours tracked by day</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Hours</th>
            </tr>
          </thead>
          <tbody>
            {week.map(({ day, label, minutes, isToday }) => (
              <tr key={day}>
                <th scope="row">{isToday ? `${label} (today)` : `${label} ${day}`}</th>
                <td>{(minutes / 60).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
