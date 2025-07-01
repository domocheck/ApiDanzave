import { ClassesActives, IClaseStudentsDash } from "../../Classes/Models/classes.models";
import { Price } from "../../Config/Models/Config.models";
import { FilteringOptionsStatus, NameAndId } from "../../Others/Models/Others";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class Students extends ResponseMessages {
    Items!: IStudents[];
    TotalItems = 0
}

export class PagedListStudents extends ResponseMessages {
    Items: IPagedListStudent[] = [];
    TotalItems = 0;
    PageSize = 0;
    FilteringOptions: NameAndId[] = new FilteringOptionsStatus().Items;
}

export class OptionsFormStudent extends ResponseMessages {
    ClassesGropued: ClassesActives[] = [];
    Prices: Price[] = [];
    TuitionPrices: Price[] = [];
}

export class StudentsActivesResponse extends ResponseMessages {
    Items: StudentsActives[] = [];
}


export interface IPagedListStudent {
    id: string;
    status: string;
    fullName: string;
    numberOfClasses: number;
}

export interface ChangeStatusPerson {
    id: string;
    newStatus: string;
    reasonId: string;
    observation: string;
}

export interface ISudentsDash {
    id: string;
    displayName: string;
    createdDate: string;
    inactiveDate?: string;
    classes: IClaseStudentsDash[];
    reason?: string;
    observationsInactive: string;
}

export interface IStudents {
    id: string;
    name: string;
    lastName: string;
    birthday?: string;
    dni?: number;
    phone?: number;
    email?: string;
    photo?: string | unknown;
    isFit?: boolean;
    parent?: Parent;
    status?: string;
    classes?: string[];
    activities?: string[];
    school?: School;
    reference?: string;
    contactMedia?: string;
    monthly: string;
    discount?: string | number;
    observations?: string;
    createDate?: Date | string;
    updateDate?: Date | string;
    activatedDate?: Date | string;
    inactiveDate?: Date | string;
    observationsInactive?: string;
    proofClassDate?: Date | string;
    idReason?: string;
    tuition?: string;
    displayName?: string;
    isCareerStudent?: boolean
}

export interface School {
    name: string;
    schedule: number;
}

export interface Parent {
    name: string;
    lastName: string;
    address: string;
    phone: number;
    email: string;
}

export interface StudentsActives {
    id: string;
    name: string;
    lastName: string;
    displayName: string;
    createdDate: Date | string;
}

export interface AllStudents {
    id: string;
    name: string;
    lastName: string;
    displayName: string;
    createdDate: Date | string;
    status: string;
}

export interface StudentsInactives {
    id: string;
    name: string;
    lastName: string;
    displayName: string;
    inactiveDate: Date | string;
    reason: string;
}

export interface StudentsWhitAccountExpiration {
    name: string;
    id: string;
    lastPaymentAmount: number;
    lastPaymentDate: string;
    nextPaymentDate: string;
    isExpiration: boolean;
}

export interface EnrolledStudents {
    id: string;
    name: string;
    tuitionPaymentStatus: string;
    tuitionPaymentDate: string;
    tuitionPaymentAmount: number;
    dateCreated: string;
    status: string;
}
