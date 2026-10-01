export const formatCurrency = (num) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-';

export const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('');