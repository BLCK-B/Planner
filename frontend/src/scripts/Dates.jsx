export const calcTimeToDate = (dateString) => {
  const date = new Date(dateString);
  const present = new Date();
  date.setHours(0, 0, 0, 0);
  present.setHours(0, 0, 0, 0);
  const one_day = 1000 * 60 * 60 * 24;
  const result = Math.round((date.getTime() - present.getTime()) / one_day);
  return result;
};

export const textualTimeToDate = (dateString) => {
  const timeToDate = calcTimeToDate(dateString);
  if (timeToDate === 0) return "due today";
  else if (timeToDate > 0) return `${timeToDate} days left`;
  else return `${Math.abs(timeToDate)} days ago`;
};

export const isDatePast = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const present = new Date();
  date.setHours(0, 0, 0, 0);
  present.setHours(0, 0, 0, 0);
  return date.getTime() - present.getTime() + 1 < 1;
};
