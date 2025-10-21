import { formatDateToDate } from "./FormatDateToDate";

type SortOrder = "asc" | "desc";

export function sortByDateProperty<T extends Record<string, any>>(
    list: T[],
    dateProp: keyof T,
    order: SortOrder = "desc"
): T[] {
    return [...list].sort((a, b) => {
        const fechaA = formatDateToDate(a[dateProp] as string);
        const fechaB = formatDateToDate(b[dateProp] as string);

        if (order === "asc") return fechaA.getTime() - fechaB.getTime();
        return fechaB.getTime() - fechaA.getTime();
    });
}
