export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-';

export const calculateDays = (start, end) => {
  const diff = Math.abs(new Date(end) - new Date(start));
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};