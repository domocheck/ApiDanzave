import { IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getDifferenceInDays } from "../../Others/Helpers/DifferenceInDays";
import { formatDateToDate } from "../../Others/Helpers/FormatDateToDate";

export function checkStatusActivity(act: IContactsActivities): string {
    const now = new Date();
    const dateContactAct = formatDateToDate(act.nextContactDate?.toString());

    const differenceInDays = getDifferenceInDays(now, dateContactAct!);

    if (differenceInDays > 0) return 'Sin vencer';
    if (differenceInDays >= -2) return 'Vencida';
    return 'En peligro';
}

export const getPreviousDayBeforeNextTargetDay = (targetDay: number): string => {
    const today = new Date();
    const todayDay = today.getDay();

    // Check if the target day is today
    if (targetDay === todayDay) {
        return formatDate(today);
    }

    // Calculate the difference to the next target day
    let difference = targetDay - todayDay;
    if (difference <= 0) {
        difference += 7;
    }

    // Calculate the next target day date
    const nextTargetDay = new Date(today);
    nextTargetDay.setDate(today.getDate() + difference);

    // Get the day before the next target day
    const dayBeforeNextTargetDay = new Date(nextTargetDay);
    dayBeforeNextTargetDay.setDate(nextTargetDay.getDate() - 1);
    return formatDate(dayBeforeNextTargetDay);
};

function formatDate(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}