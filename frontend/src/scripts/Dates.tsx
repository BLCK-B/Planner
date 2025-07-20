export const calcTimeToDate = (dateString: string) => {
  const date = new Date(dateString);
  const present = new Date();
  date.setHours(0, 0, 0, 0);
  present.setHours(0, 0, 0, 0);
  const one_day = 1000 * 60 * 60 * 24;
  const result = Math.round((date.getTime() - present.getTime()) / one_day);
  return result;
};

export const textualTimeToDate = (dateString: string) => {
  const numberOfDays = calcTimeToDate(dateString);
  if (numberOfDays === 0) return "due today";
  else if (numberOfDays === 1) return "tomorrow";
  else if (numberOfDays === -1) return "yesterday";

  const futureOrPast = numberOfDays > 0 ? " left" : " ago";
  const dayDiff = Math.abs(numberOfDays);

  const years = Math.floor(dayDiff / 365);
  const months = Math.floor((dayDiff % 365) / 30);
  const parts = [];
  if (years > 0) {
    parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
  } else if (months > 2) {
    parts.push(`${months}mo`);
  } else {
    parts.push(`${dayDiff} days`);
  }
  return parts.join(" ") + futureOrPast;
};

export const isDatePast = (dateString: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const present = new Date();
  date.setHours(0, 0, 0, 0);
  present.setHours(0, 0, 0, 0);
  return date.getTime() - present.getTime() + 1 < 1;
};
