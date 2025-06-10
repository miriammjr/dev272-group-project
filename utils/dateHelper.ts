export const calculateDaysRemaining = (dueDate: string): string => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays < 0
    ? 'Over Due'
    : `${diffDays} day${diffDays === 1 ? '' : 's'}`;
};
