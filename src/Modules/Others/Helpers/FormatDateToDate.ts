export const formatDateToDate = (date: string) => {
    const regex = /(\d{1,2}) de (\w+) de (\d{4})/;
    const match = date.match(regex);

    if (!match) {
        throw new Error("Formato de fecha no válido");
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
