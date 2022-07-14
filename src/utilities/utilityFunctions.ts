export const convertToHourMin = (timeMin: number): string => {
  const hour = Math.trunc(timeMin / 60);
  if (timeMin % 60 === 0) return `${hour}h`;
  const min = timeMin - hour * 60;
  return `${hour}h ${min}min`;
};

export const getYearOnly = (dateString: string): string => {
  return dateString.slice(0, 4);
};
