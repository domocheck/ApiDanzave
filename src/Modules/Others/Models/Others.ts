export class Status {
    Status!: string | undefined;
}

export interface Days {
    day: number;
    hasClass?: boolean;
    hasActivity?: boolean;
    isActive: boolean;
    dayOfWeek?: number;
    dateOfActivity?: Date;
}

export interface HeadersTable {
    value: string;
    name: string;
    content?: string;
    visible?: string;
    isDefault?: boolean;
    children?: number[];
    disabled?: boolean;
}

export interface FilterTable {
    value: string;
    name: string;
    content: string;
}

export interface ValuesTable {
    value: string;
    title: string;
    parentPath: string;
    childPath: string;
}

export interface ConfigurationAlert {
    primaryText: string;
    secondaryText?: string;
    type: string;
    duration?: number;
}

export interface PersonToACt {
    id: string;
    name: string;
    idAct: string;
}
export interface SearchClassByDate {
    date: string | number;
    idClass: string;
}

export interface SearchByDates {
    dateStart: string | number;
    dateEnd: string | number;
    idPerson: string;
    payment: string;
}

export interface NameAndValue {
    name: string;
    value: number;
}

export interface NameAndValues {
    name: string;
    data: number[];
}

export interface TextAndValueIcon {
    text: string;
    value: number | string;
    icon: string
}


export interface NameAndId {
    name: string;
    id: string;
}

export interface PersonAvgAssist {
    id: string;
    displayName: string;
    avgAssists: number;
    type: string;
    reasonAssits: string;
}

export interface ContentPDF {
    text: string;
    bold: boolean;
}

export class EmailCloseTable {
    dateClose!: string;
    dateOpen!: string;
    quantityMoves!: number;
    eftIncome!: number;
    transferIncome!: number;
    mpIncome!: number;
    totalIncome!: number;
    eftOutcome!: number;
    transferOutcome!: number;
    mpOutcome!: number;
    totalOutcome!: number;
    eftTotal!: number;
    transferTotal!: number;
    mpTotal!: number;
    totalTotal!: number;
}

export interface Dates {
    month: string;
    days: number[];
}

export class FilteringOptionsStatus {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: "all",
                name: "Todos"
            },
            {
                id: "activo",
                name: "Activo"
            },
            {
                id: "inactivo",
                name: "Inactivo"
            }
        ]
    }
}

export class FilteringOptionsAccountsStatus {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: "all",
                name: "Todos"
            },
            {
                id: "paid",
                name: "Paga"
            },
            {
                id: "pending",
                name: "Pendiente"
            }
        ]
    }
}

export class FilteringOptionsActivitiesStatus {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: "all",
                name: "Todas"
            },
            {
                id: 'toComplete',
                name: 'Vencidas y En Peligro',
            },
            {
                id: 'warning',
                name: 'Vencidas',
            },
            {
                id: 'danger',
                name: 'En Peligro',
            },
            {
                id: 'ok',
                name: 'Sin vencer',
            }
        ]
    }
}

export class FilteringOptionsActivitiesActivity {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: 'follow',
                name: 'Seguimiento',
            },
            {
                id: 'proofClass',
                name: 'Clase de prueba',
            },
        ]
    }
}

export class FilteringOptionsActivitiesInterest {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: 'low',
                name: 'Interes Bajo',
            },
            {
                id: 'medium',
                name: 'Interes Medio',
            },
            {
                id: 'high',
                name: 'Interes Alto',
            },
        ]
    }
}

export class FilteringOptionsLounges {
    Items: NameAndValue[] = []

    constructor() {
        this.Items = [
            {
                value: 1,
                name: 'Salon 1',
            },
            {
                value: 1,
                name: 'Salon 2',
            },
            {
                value: 1,
                name: 'Salon 3',
            },
        ]
    }
}

export class FilteringOptionsTuitionPaymentStatus {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: "all",
                name: "Todos"
            },
            {
                id: "paid",
                name: "Pagó matricula"
            },
            {
                id: "pending",
                name: "Pendiente de pago"
            },
            {
                id: "noAccount",
                name: "Sin cuenta generada"
            }
        ]
    }
}

export class FilteringOptionsAssists {
    Items: NameAndId[] = []

    constructor() {
        this.Items = [
            {
                id: "all",
                name: "Todos"
            },
            {
                id: "Ausente con aviso",
                name: "Ausente con aviso"
            },
            {
                id: "Ausente sin aviso",
                name: "Ausente sin aviso"
            },
            {
                id: "Clase de prueba",
                name: "Clase de prueba"
            },
            {
                id: "Por enfermedad",
                name: "Por enfermedad"
            },
            {
                id: "Presentes",
                name: "Presente"
            },
            {
                id: "Sin asistencia",
                name: "Sin asistencia"
            }
        ]
    }
}
