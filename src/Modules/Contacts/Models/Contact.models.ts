import { ClassesActives } from "../../Classes/Models/classes.models";
import { IPayments, Reference } from "../../Config/Models/Config.models";
import { IMovement } from "../../Drawers/Models/Drawer.models";
import { NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { User } from "../../Others/Models/Users";
import { Parent, School } from "../../Students/Models/Students.models";
export class Contacts extends ResponseMessages {
    Items: IContacts[] = [];
    TotalItems = 0
}

export class OptionsFormContact extends ResponseMessages {
    ClassesActives: ClassesActives[] = [];
    References: Reference[] = []
    ContactsMedia: Reference[] = [];
    Interest: string[] = [];
}

export class ActivityInd extends ResponseMessages {
    Activity: IContactsActivities = {} as IContactsActivities;
    Contact: IContacts = {} as IContacts;
    History: HistoryActivity[] = [];
    ClassesActives: ClassesActives[] = [];
    Status: string[] = [];
    Results: string[] = [];
    PaymentsMethods: IPayments[] = [];
    Movement?: IMovement
    UsersActives: NameAndId[] = [];

    constructor() {
        super();
        this.Status = [
            'Seguirlo',
            'No va a venir y seguirlo',
            'No va a venir y cerrar',
            'Va a venir y seguirlo',
            'Se convierte en alumno',
        ];

        this.Results = ['Seguimiento', 'Clase de prueba', 'Se convierte en alumno', 'Cierre']
    }
}

export class UpdateActivityResponse extends ResponseMessages {
    Response: string = "";
    ActivityId?: string;
    ContactId?: string;
}

export interface UpdateActivity {
    Result?: string;
    Status?: string;
    Classe?: string;
    NextContact?: number;
    Observations?: string;
    ActivityId: string;
    ContactId: string;
    UserId?: string;
}


export interface IContacts {
    id: string;
    name: string;
    lastName: string;
    birthday?: string;
    dni?: number;
    phone?: number;
    email?: string;
    photo?: string;
    isFit?: boolean;
    parent?: Parent;
    status: string;
    classes?: string[];
    activities?: string[];
    school?: School;
    reference: string;
    contactMedia: string;
    observations?: string;
    createDate?: Date | string;
    updateDate?: Date | string;
    inactiveDate?: Date | string;
    observationsInactive?: string;
    proofClassDate?: Date | string;
    toStudentDate?: Date | string;
    interest: string;
    displayName?: string;
    idReason?: string;
}

export interface IContactsActivities {
    id: string;
    contactId: string;
    observations: string;
    dateCreated: Date | string;
    updateDate: Date | string;
    fulfillDate: Date | string | null;
    nextContactDate: Date | string;
    result: string;
    status: string | null;
    userId: string;
    movement?: IMovement
}

export interface ActivityToTable {
    activityId: string;
    contactId: string;
    name: string;
    lastName: string;
    phone: number | string;
    interest: string;
    activity: string;
    nextContactDate: string;
    status: string;
    userId: string;
    reference: string;
}

export interface HistoryActivity {
    activityId: string;
    observation: string;
    dateCreate: string;
    userId: string;
    userName: string;
}

export interface ActivitiesToStats {
    completes: ActivityToStat[];
    toCompleteToday: ActivityToStat[];
    toComplete: ActivityToStat[];
}

export interface ActivityToStat {
    id: string;
    contactName: string;
    observations: string;
    dateCreated: Date | string;
    updateDate: Date | string;
    fulfillDate: Date | string | null;
    nextContactDate: Date | string;
    result: string;
    status: string | null;
    userName: string;
    contactId: string;
    userId: string;
}

export interface ContactsProofClass {
    id: string;
    name: string;
    className: string;
    dateClass: string;
    classId: string;
}
