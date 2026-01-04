import type {TaskType} from "@/types/TaskType.ts";

export const daysFromToday = (dateString: string) => {
    const date = new Date(dateString);
    const present = new Date();
    date.setHours(0, 0, 0, 0);
    present.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date.getTime() - present.getTime()) / oneDay);
};

export const readableTimeToDate = (dateString: string) => {
    const numberOfDays = daysFromToday(dateString);
    if (numberOfDays === 0) return "today";
    else if (numberOfDays === 1) return "tomorrow";
    else if (numberOfDays === -1) return "yesterday";

    let lastPart = "";
    let firstPart = "";
    if (numberOfDays > 0) {
        firstPart = "in ";
    } else if (numberOfDays < 0) {
        lastPart = " ago";
    }

    const dayDiff = Math.abs(numberOfDays);

    const years = Math.floor(dayDiff / 365);
    const months = Math.floor((dayDiff % 365) / 30);
    const parts = [];
    if (years > 0) {
        if (months === 12) {
            parts.push(`${years + 1}y`);
        } else {
            parts.push(`${years}y`);
        }
        if (months > 0 && months < 12 && years < 3) parts.push(`${months}m`);
    } else if (months > 1) {
        parts.push(`${months} mo`);
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
    return date.getTime() - present.getTime() < 0;
};

/**
 * returns yyyy-MM-dd in UTC including timezone
 */
export const getTodaysDate = () => {
    return new Date().toISOString().slice(0, 10);
};

export const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
};

export const dateToReadableDDMM = (date: string) => {
    const asDate = new Date(date);
    const day = asDate.getDate();
    const month = asDate.getMonth() + 1;
    return `${day}. ${month}.`;
}

export const getNextDate = (previousDate: string, repeat: string, originDay: number): string => {
    const date = new Date(previousDate);
    // avoid hour offset changing date
    date.setHours(12, 0, 0, 0);

    switch (repeat) {
        case "week":
            date.setDate(date.getDate() + 7);
            break;
        case "two-weeks":
            date.setDate(date.getDate() + 14);
            break;
        case "month": {
            const month = date.getMonth();
            const year = date.getFullYear();
            const nextMonth = month + 1;
            const lastDayNextMonth = new Date(year, nextMonth + 1, 0).getDate();
            // months have different number of days
            const newDay = Math.min(originDay, lastDayNextMonth);
            date.setFullYear(year, nextMonth, newDay);
            break;
        }
    }
    return date.toISOString().split("T")[0];
};

export const globalDateFormatter = (task: TaskType, showExactDates: boolean) => {
    if (!task.data.completed && showExactDates) {
        return dateToReadableDDMM(task.data.date);
    }
    if (!task.data.completed && !showExactDates) {
        return readableTimeToDate(task.data.date);
    }
    if (task.data.completed && showExactDates) {
        return dateToReadableDDMM(task.data.completed);
    }
    if (task.data.completed && !showExactDates) {
        return readableTimeToDate(task.data.completed);
    }
};