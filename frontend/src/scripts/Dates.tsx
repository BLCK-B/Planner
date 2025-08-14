export const calcTimeToDate = (dateString: string) => {
    const date = new Date(dateString);
    const present = new Date();
    date.setHours(0, 0, 0, 0);
    present.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date.getTime() - present.getTime()) / oneDay);
};

export const textualTimeToDate = (dateString: string, isDeadline: string) => {
    const numberOfDays = calcTimeToDate(dateString);
    if (numberOfDays === 0) return "due today";
    else if (numberOfDays === 1) return "tomorrow";
    else if (numberOfDays === -1) return "yesterday";

    let lastPart = "";
    let firstPart = "";
    if (numberOfDays > 0) {
        if (isDeadline !== "false") {
            lastPart = " left";
        } else {
            firstPart = "in ";
        }
    } else if (numberOfDays < 0) {
        lastPart = " ago";
    }

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
    return firstPart + parts.join(" ") + lastPart;
};

export const isDatePast = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const present = new Date();
    date.setHours(0, 0, 0, 0);
    present.setHours(0, 0, 0, 0);
    return date.getTime() - present.getTime() + 1 < 1;
};

export const getDateToday = () => {
    const today = new Date();
    return `${today.getDate()}. ${today.getMonth() + 1}.`;
};

export const ddMMyyyy = (date: string) => {
    const asDate = new Date(date);
    const day = asDate.getDate();
    const month = asDate.getMonth() + 1;
    const year = asDate.getFullYear();
    // return `${day}. ${month}. ${year}`;
    return `${day}. ${month}.`;
}

export const getNextDate = (originalDate: string, repeat: string): string => {
    const date = new Date(originalDate);
    // avoid hour offset chaging date
    date.setHours(12, 0, 0, 0);

    switch (repeat) {
        case "week":
            date.setDate(date.getDate() + 7);
            break;
        case "two-weeks":
            date.setDate(date.getDate() + 14);
            break;
        case "month": {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            const nextMonth = month + 1;
            const lastDayNextMonth = new Date(year, nextMonth + 1, 0).getDate();
            // months have different number of days
            const newDay = Math.min(day, lastDayNextMonth);
            date.setFullYear(year, nextMonth, newDay);
            break;
        }
    }
    return date.toISOString().split("T")[0];
};
