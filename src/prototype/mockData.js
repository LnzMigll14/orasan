/**
 * Mock data for the Orasan prototype. Invented, labelled as mock data.
 * "Today" in the prototype is Wed 18 Nov 2026. Entries cover 4–17 Nov.
 * Throw-away: lives in src/prototype.
 */

export const TODAY = new Date('2026-11-18T10:00:00')

export const PROFILE = {
  name: 'Mika Santos',
  business: 'Mika Santos Studio',
  email: 'mika@mikasantos.example',
  tin: '',
  defaultCurrency: 'PHP',
}

/** Payment methods the user can turn on in Settings. Invoices show only those matching their currency. */
export const PAYMENT_METHODS = [
  {
    id: 'gcash',
    label: 'GCash',
    currency: 'PHP',
    enabled: true,
    fields: [
      { key: 'name', label: 'Account name', value: 'Mika Santos' },
      { key: 'number', label: 'Number', value: '0917 555 0142' },
    ],
  },
  {
    id: 'maya',
    label: 'Maya',
    currency: 'PHP',
    enabled: false,
    fields: [
      { key: 'name', label: 'Account name', value: '' },
      { key: 'number', label: 'Number', value: '' },
    ],
  },
  {
    id: 'bank',
    label: 'Bank transfer',
    currency: 'PHP',
    enabled: true,
    fields: [
      { key: 'bank', label: 'Bank', value: 'BPI' },
      { key: 'name', label: 'Account name', value: 'Mika Santos' },
      { key: 'number', label: 'Account no.', value: '1234 5678 90' },
    ],
  },
  {
    id: 'wise',
    label: 'Wise',
    currency: 'USD',
    enabled: true,
    fields: [{ key: 'email', label: 'Email', value: 'mika@mikasantos.example' }],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    currency: 'USD',
    enabled: true,
    fields: [{ key: 'email', label: 'Email', value: 'pay@mikasantos.example' }],
  },
  {
    id: 'payoneer',
    label: 'Payoneer',
    currency: 'USD',
    enabled: false,
    fields: [{ key: 'email', label: 'Email', value: '' }],
  },
]

export const SETTINGS = {
  prefix: 'INV-',
  nextNumber: 13,
  dueDays: 14,
  rounding: 'none', // none | 6 | 15 (minutes, per entry, rounded up)
  dailyGoal: 8, // hours; 0 hides the goal line on the Dashboard chart
  theme: 'system', // light | dark | system
}

export const CLIENTS = [
  {
    id: 'northwind',
    name: 'Northwind Remote LLC',
    contact: 'Dana Whitfield',
    email: 'ap@northwind.example',
    currency: 'USD',
    rate: 12,
  },
  {
    id: 'reyes',
    name: 'Reyes Studio',
    contact: 'Carla Reyes',
    email: 'billing@reyesstudio.example',
    currency: 'PHP',
    rate: 1200,
  },
  {
    id: 'kalye',
    name: 'Kalye Coffee Co.',
    contact: 'Joel Tan',
    email: 'hello@kalyecoffee.example',
    currency: 'PHP',
    rate: 900,
  },
]

/** `rate: null` means the project uses the client's rate. */
export const PROJECTS = [
  { id: 'va', clientId: 'northwind', name: 'VA retainer', rate: null },
  { id: 'inbox', clientId: 'northwind', name: 'Inbox & calendar', rate: null },
  { id: 'brand', clientId: 'reyes', name: 'Brand refresh', rate: null },
  { id: 'web', clientId: 'reyes', name: 'Website build', rate: 1500 },
  { id: 'menu', clientId: 'kalye', name: 'Menu copy', rate: null },
  { id: 'social', clientId: 'kalye', name: 'Social captions', rate: null },
]

const e = (id, projectId, day, from, to, description, invoiceId = null) => ({
  id,
  projectId,
  description,
  start: new Date(`2026-11-${day}T${from}:00`),
  end: new Date(`2026-11-${day}T${to}:00`),
  invoiceId,
})

export const ENTRIES = [
  e('e01', 'va', '04', '09:00', '11:15', 'Inbox triage and client replies', 'inv12'),
  e('e02', 'menu', '04', '13:00', '15:30', 'Menu copy, breakfast section', 'inv11'),
  e('e03', 'inbox', '05', '08:30', '10:00', 'Calendar cleanup for Q4 travel', 'inv12'),
  e('e04', 'social', '05', '10:30', '13:00', 'Caption batch for November promos', 'inv11'),
  e('e05', 'brand', '05', '14:00', '17:30', 'Moodboard and type exploration'),
  e('e06', 'va', '06', '09:00', '11:00', 'Vendor follow-ups', 'inv12'),
  e('e07', 'menu', '06', '13:00', '16:00', 'Menu copy, drinks and pastries', 'inv11'),
  e('e08', 'brand', '09', '09:00', '12:30', 'Logo sketches, round 1'),
  e('e09', 'social', '09', '13:30', '15:00', 'Holiday caption drafts', 'inv11'),
  e('e10', 'va', '10', '08:00', '10:30', 'Inbox triage and client replies'),
  e('e11', 'web', '10', '10:45', '13:45', 'Sitemap and wireframes'),
  e('e12', 'brand', '10', '14:30', '17:00', 'Logo refinement'),
  e('e13', 'inbox', '11', '09:00', '10:15', 'Travel booking for the Manila trip'),
  e('e14', 'web', '11', '10:30', '14:00', 'Homepage layout'),
  e('e15', 'va', '12', '08:30', '11:00', 'Weekly report and inbox'),
  e('e16', 'menu', '12', '13:00', '14:30', 'Menu copy revisions'),
  e('e17', 'brand', '12', '15:00', '17:15', 'Colour palette options'),
  e('e18', 'web', '13', '09:00', '12:00', 'Product page wireframes'),
  e('e19', 'social', '13', '13:00', '15:00', 'Caption batch for December'),
  e('e20', 'va', '16', '08:00', '09:45', 'Inbox triage and client replies'),
  e('e21', 'brand', '16', '10:00', '13:30', 'Brand guidelines draft'),
  e('e22', 'inbox', '17', '08:30', '09:30', 'Calendar and meeting notes'),
  e('e23', 'web', '17', '10:00', '12:15', 'Responsive checks, homepage'),
  e('e24', 'brand', '17', '13:30', '16:00', 'Brand guidelines, final pass'),
  e('e25', 'va', '17', '16:15', '17:30', 'Inbox triage and client replies'),
  e('e26', 'inbox', '18', '08:15', '09:45', 'Morning inbox and calendar'),
]

/**
 * Invoices. Lines come from linked entries (grouped by project) plus `staticLines`
 * for work billed before the two-week window. Overdue = sent and past due.
 */
export const INVOICES = [
  {
    id: 'inv09',
    number: 'INV-0009',
    clientId: 'reyes',
    status: 'sent',
    issued: new Date('2026-10-24T09:00:00'),
    due: new Date('2026-11-07T09:00:00'),
    staticLines: [{ description: 'Brand discovery and research', from: '2026-10-13', to: '2026-10-24', hours: 30, rate: 1200 }],
    payment: null,
    token: 'r9x2kq',
  },
  {
    id: 'inv10',
    number: 'INV-0010',
    clientId: 'northwind',
    status: 'paid',
    issued: new Date('2026-11-01T09:00:00'),
    due: new Date('2026-11-15T09:00:00'),
    staticLines: [{ description: 'VA retainer', from: '2026-10-13', to: '2026-10-31', hours: 40, rate: 12 }],
    payment: { method: 'wise', reference: 'P-88412-NW', date: new Date('2026-11-10T09:00:00') },
    token: 'n4d8wm',
  },
  {
    id: 'inv11',
    number: 'INV-0011',
    clientId: 'kalye',
    status: 'sent',
    issued: new Date('2026-11-10T09:00:00'),
    due: new Date('2026-11-24T09:00:00'),
    staticLines: [],
    payment: null,
    token: 'k7c3pa',
  },
  {
    id: 'inv12',
    number: 'INV-0012',
    clientId: 'northwind',
    status: 'draft',
    issued: new Date('2026-11-13T09:00:00'),
    due: new Date('2026-11-27T09:00:00'),
    staticLines: [],
    payment: null,
    token: 'n2f6ta',
  },
]
