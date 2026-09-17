const manilaTimeZone = 'Asia/Manila';

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatTimeSlot(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: manilaTimeZone,
  });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: manilaTimeZone,
  }).format(new Date(value));
}

export function formatQueueNumber(queueNumber: number) {
  return `#${String(queueNumber).padStart(3, '0')}`;
}

export function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
