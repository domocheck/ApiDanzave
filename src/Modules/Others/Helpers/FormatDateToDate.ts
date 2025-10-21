import { format } from "@formkit/tempo";

export const formatDateToDate = (date: string): Date => {
    if (!date) return new Date('2024-01-01T00:00:00.000Z');
    const regex = /(\d{1,2}) de (\w+) de (\d{4})/;
    let match = date.match(regex);

    if (!match) {
        try {
            const newDate = convertirFechaInglesAEspanol(date);
            match = newDate.match(regex); // reintentar parsear
            if (!match) throw new Error(); // en caso de que aún no funcione
        } catch (error) {
            throw new Error("Formato de fecha no válido");
        }
    }

    const [_, dia, mesTexto, año] = match;

    const meses: { [key: string]: string } = {
        enero: '01',
        febrero: '02',
        marzo: '03',
        abril: '04',
        mayo: '05',
        junio: '06',
        julio: '07',
        agosto: '08',
        septiembre: '09',
        octubre: '10',
        noviembre: '11',
        diciembre: '12',
    };

    const mes = meses[mesTexto.toLowerCase()];
    const dateUTC = new Date(Date.UTC(
        parseInt(año),
        parseInt(mes) - 1,
        parseInt(dia)
    ));
    return dateUTC;
};



export const normalizeDate = (d: Date): Date => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export function convertirFechaInglesAEspanol(fechaEnIngles: string) {
    const diasSemana = [
        'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
    ];
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const parsedDate = new Date(fechaEnIngles);

    if (isNaN(parsedDate.getTime())) {
        return fechaEnIngles;
    }

    const diaSemana = diasSemana[parsedDate.getDay()];
    const dia = parsedDate.getDate();
    const mes = meses[parsedDate.getMonth()];
    const anio = parsedDate.getFullYear();

    return `${diaSemana}, ${dia} de ${mes} de ${anio}`;
}
