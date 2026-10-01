export const formatCurrency = (num) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num || 0);

// month بصيغة "YYYY-MM"
export const formatMonth = (date) => {
  if (!date) return '-';
  const d = new Date(`${date}-01`);
  return isNaN(d) ? '-' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('');

export const calculatePF = (salary) => (Number(salary) || 0) * 0.12;