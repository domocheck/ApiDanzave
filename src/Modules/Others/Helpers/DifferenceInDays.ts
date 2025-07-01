export const getDifferenceInDays = (date1: Date, date2: Date): number => {
    // Normalizar las fechas a medianoche
    const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const normalizedDate1 = normalizeDate(date1);
    const normalizedDate2 = normalizeDate(date2);

    const oneDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
    return (normalizedDate2.getTime() - normalizedDate1.getTime()) / oneDay;
};
