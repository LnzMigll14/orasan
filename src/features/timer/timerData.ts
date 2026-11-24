// The reference date and week start make the sample summary reproducible.
export const timerPageData = {
  timeZone: 'Asia/Manila',
  referenceDate: '2026-11-18',
  weekStartsOn: '2026-11-16',
  defaultProjectId: 'reyes-brand-refresh',

  projects: {
    'reyes-brand-refresh': { name: 'Brand refresh', client: 'Reyes Studio' },
    'reyes-website-build': { name: 'Website build', client: 'Reyes Studio' },
    'northwind-inbox-calendar': { name: 'Inbox & calendar', client: 'Northwind Remote LLC' },
    'northwind-va-retainer': { name: 'VA retainer', client: 'Northwind Remote LLC' },
    'kalye-menu-copy': { name: 'Menu copy', client: 'Kalye Coffee Co.' },
  },

  // Group by the Manila calendar date. Store each entry's timestamps in UTC.
  days: [
    {
      date: '2026-11-18',
      entries: [
        {
          id: 'entry-01',
          description: 'Morning inbox and calendar',
          projectId: 'northwind-inbox-calendar',
          startedAt: '2026-11-18T00:15:00Z',
          endedAt: '2026-11-18T01:45:00Z',
          invoiceId: null,
        },
      ],
    },
    {
      date: '2026-11-17',
      entries: [
        {
          id: 'entry-02',
          description: 'Inbox triage and client replies',
          projectId: 'northwind-va-retainer',
          startedAt: '2026-11-17T08:15:00Z',
          endedAt: '2026-11-17T09:30:00Z',
          invoiceId: null,
        },
        {
          id: 'entry-03',
          description: 'Brand guidelines, final pass',
          projectId: 'reyes-brand-refresh',
          startedAt: '2026-11-17T05:30:00Z',
          endedAt: '2026-11-17T08:00:00Z',
          invoiceId: null,
        },
        {
          id: 'entry-04',
          description: 'Responsive checks, homepage',
          projectId: 'reyes-website-build',
          startedAt: '2026-11-17T02:00:00Z',
          endedAt: '2026-11-17T04:15:00Z',
          invoiceId: null,
        },
        {
          id: 'entry-05',
          description: 'Calendar and meeting notes',
          projectId: 'northwind-inbox-calendar',
          startedAt: '2026-11-17T00:30:00Z',
          endedAt: '2026-11-17T01:30:00Z',
          invoiceId: null,
        },
      ],
    },
    {
      date: '2026-11-16',
      entries: [
        {
          id: 'entry-06',
          description: 'Brand guidelines draft',
          projectId: 'reyes-brand-refresh',
          startedAt: '2026-11-16T02:00:00Z',
          endedAt: '2026-11-16T05:30:00Z',
          invoiceId: null,
        },
        {
          id: 'entry-07',
          description: 'Inbox triage and client replies',
          projectId: 'northwind-va-retainer',
          startedAt: '2026-11-16T00:00:00Z',
          endedAt: '2026-11-16T01:45:00Z',
          invoiceId: null,
        },
      ],
    },
    {
      date: '2026-11-06',
      entries: [
        {
          id: 'entry-08',
          description: 'Menu copy, drinks and pastries',
          projectId: 'kalye-menu-copy',
          startedAt: '2026-11-06T05:00:00Z',
          endedAt: '2026-11-06T08:00:00Z',
          invoiceId: 'INV-0011',
        },
        {
          id: 'entry-09',
          description: 'Vendor follow-ups',
          projectId: 'northwind-va-retainer',
          startedAt: '2026-11-06T01:00:00Z',
          endedAt: '2026-11-06T03:00:00Z',
          invoiceId: 'INV-0012',
        },
      ],
    },
  ],
} as const

export const timerDays = timerPageData.days.map((day) => ({
  ...day,
  totalMinutes: day.entries.reduce((total, entry) => {
    return total + (Date.parse(entry.endedAt) - Date.parse(entry.startedAt)) / 60_000
  }, 0),
}))

// Zero-padded ISO dates sort chronologically and support an inclusive date range.
export const weeklyMinutes = timerDays
  .filter(({ date }) => date >= timerPageData.weekStartsOn && date <= timerPageData.referenceDate)
  .reduce((total, day) => total + day.totalMinutes, 0)

export const weeklyHoursLabel = `${(weeklyMinutes / 60).toFixed(1)} h`
