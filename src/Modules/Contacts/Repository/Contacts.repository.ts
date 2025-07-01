import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IContacts } from "../Models/Contact.models";
import { ChangeStatusPerson, IPagedListContact, PagedListContacts, SearchPagedListContacts } from "../Models/Contacts-paged-list.modelst";

export const getFullNameContactById = async (id: string): Promise<string> => {
    let response = "";
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("contacts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }
        const contacts = docSnap.data()?.contacts ?? [];

        const contact = contacts.find((s: IContacts) => s.id === id);
        if (contact) {
            response = contact.name + " " + contact.lastName;
        }
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPagedListContactsRepository = async (search: SearchPagedListContacts): Promise<PagedListContacts> => {
    const response = new PagedListContacts();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("contacts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let contactsData = docSnap.data()?.contacts.filter((c: IContacts) => c.status !== 'inhabilitado');

        if (!Array.isArray(contactsData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            contactsData = contactsData.filter((item: IContacts) => item.status === search.Status);
        }

        if (search.Name) {
            contactsData = contactsData.filter((item: IContacts) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedContacts = contactsData.slice(startIndex, endIndex);

        response.Items = paginatedContacts.map((s: IContacts): IPagedListContact => {
            return {
                id: s.id,
                status: s.status,
                fullName: `${s.name} ${s.lastName}`,
                phone: s.phone,
                reference: s.reference,
                contactMedia: s.contactMedia,
                firstContactDate: s.createDate as string
            }
        })
        response.TotalItems = contactsData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const changeStatusContactRepository = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("contacts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const contacts = docSnap.data()?.contacts ?? [];

        const contact: IContacts = contacts.find((s: IContacts) => s.id === changeStatus.id);

        if (!contact) {
            throw new Error("No se encontro el contacto");
        }

        contact.status = changeStatus.newStatus;

        if (changeStatus.newStatus === 'inactivo') {
            if (contact.classes && contact.classes.length > 0) {
                for (let classe of contact.classes) {
                    await removeStudentToClassRepository(classe, changeStatus.id);
                }
            }
            contact.classes = [];
            contact.inactiveDate = format(new Date(), 'full');
        }

        contact.idReason = changeStatus.reasonId;
        contact.observationsInactive = changeStatus.observation;
        await docRef.update({ contacts });

        response.setSuccess("Contacto actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const getContactByIdRepository = async (id: string): Promise<IContacts> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("contacts");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el contacto")
        }

        let contact: IContacts = docSnap.data()?.contacts.filter((t: IContacts) => t.id === id)[0];

        return contact;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontro el contacto")
    }
}

export const getContactsByStatusRepository = async (status: string): Promise<IContacts[]> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("contacts");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el contacto")
        }

        let contacts: IContacts[] = docSnap.data()?.contacts.filter((t: IContacts) => t.status === status);

        return contacts;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontro el contacto")
    }
}

export const saveContactRepository = async (student: IContacts): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("contacts");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const contacts: IContacts[] = docSnap.data()?.contacts ?? [];
        const index = contacts.findIndex((s: IContacts) => s.id === student.id);

        if (index !== -1) {
            contacts.splice(index, 1, student);
        } else {
            contacts.unshift(student);
        }

        await docRef.update({ contacts });
        response.setSuccess("Contacto actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}