import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IContacts } from "../Models/Contact.models";
import { ChangeStatusPerson, IPagedListContact, PagedListContacts, SearchPagedListContacts } from "../Models/Contacts-paged-list.modelst";

export const getFullNameContactById = async (id: string): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return "";

        const docRef = db.collection(companyName).doc("contacts").collection("contacts").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return "";
        }

        const contact = docSnap.data() as IContacts;

        if (!contact || !contact.name || !contact.lastName) {
            throw new Error("Datos del contacto incompletos");
        }

        return `${contact.name} ${contact.lastName}`;
    } catch (error) {
        console.error("Error obteniendo contacto:", error);
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
        let docRef;

        if (search.Status && search.Status !== 'all') {
            docRef = db.collection(companyName).doc("contacts").collection("contacts").where("status", "!=", "inhabilitado").where("status", "==", search.Status);
        } else {
            docRef = db.collection(companyName).doc("contacts").collection("contacts").where("status", "!=", "inhabilitado")
        }

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron contactos");
            return response;
        }

        let contactsData = docSnap.docs.map((doc) => doc.data() as IContacts);

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
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al doc individual del estudiante
        const contactDocRef = db
            .collection(companyName)
            .doc("contacts")
            .collection("contacts")
            .doc(changeStatus.id);

        const contactDoc = await contactDocRef.get();

        if (!contactDoc.exists) {
            throw new Error("No se encontró el contact");
        }

        const contact = contactDoc.data() as IContacts;

        // Actualizamos estado
        contact.status = changeStatus.newStatus;

        if (changeStatus.newStatus === "inactivo") {
            if (contact.classes && contact.classes.length > 0) {
                for (const classe of contact.classes) {
                    await removeStudentToClassRepository(classe, changeStatus.id);
                }
            }
            contact.classes = [];
            contact.inactiveDate = format(new Date(), "full");
        }

        contact.idReason = changeStatus.reasonId;
        contact.observationsInactive = changeStatus.observation;

        // Actualizar solo el documento individual del estudiante
        await contactDocRef.update({
            status: contact.status,
            classes: contact.classes,
            inactiveDate: contact.inactiveDate,
            idReason: contact.idReason,
            observationsInactive: contact.observationsInactive,
        });

        response.setSuccess("Estudiante actualizado correctamente");
    } catch (error: any) {
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
}

export const getContactByIdRepository = async (id: string): Promise<IContacts> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const docRef = db.collection(companyName).doc("contacts").collection("contacts").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return {} as IContacts
        }

        const contact = docSnap.data() as IContacts;

        if (!contact || !contact.name || !contact.lastName) {
            throw new Error("Datos del contacto incompletos");
        }

        return contact;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontro el alumno")
    }
}

export const getContactsByStatusRepository = async (status: string): Promise<IContacts[]> => {
    try {
        let contactsByStatus = [] as IContacts[];
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const query = db
            .collection(companyName)
            .doc("contacts")
            .collection("contacts")
            .where("status", "==", status)
            .orderBy("name");

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return contactsByStatus;
        }

        contactsByStatus = querySnapshot.docs.map(doc => doc.data() as IContacts);
        return contactsByStatus;
    } catch (error) {
        console.error("Error obteniendo contactos por estado:", error);
        throw new Error("Error interno del servidor");
    }
}

export const saveContactRepository = async (contact: IContacts): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const contactRef = db
            .collection(companyName)
            .doc("contacts")
            .collection("contacts")
            .doc(contact.id); // Asegúrate de que movement.id esté definido y sea único

        await contactRef.set(contact);

        response.setSuccess("contacto guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando contacto:", error);
        response.setError(error.message);
    }

    return response;
}