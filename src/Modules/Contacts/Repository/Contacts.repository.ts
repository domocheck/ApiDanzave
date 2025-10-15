import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IContacts } from "../Models/Contact.models";
import { ChangeStatusPerson, IPagedListContact, PagedListContacts, SearchPagedListContacts } from "../Models/Contacts-paged-list.modelst";
import { getContactsModel } from "../../../mongo/schemas/contacts.schema";

export const getFullNameContactById = async (id: string): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return "";

        const ContactsModel = getContactsModel(companyName);

        const contact = await ContactsModel.findOne({ id }).lean();

        if (!contact || !contact.name || !contact.lastName) {
            return "";
        }

        return `${contact.name} ${contact.lastName}`;
    } catch (error: any) {
        console.error("Error obteniendo contacto:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getPagedListContactsRepository = async (search: SearchPagedListContacts): Promise<PagedListContacts> => {
    const response = new PagedListContacts();

    try {
        const companyName = getCompanyName();
        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const ContactsModel = getContactsModel(companyName);

        // Construir filtro
        const filter: any = { status: { $ne: 'inhabilitado' } };
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }
        if (search.Name) {
            filter.$or = [
                { name: { $regex: search.Name, $options: 'i' } },
                { lastName: { $regex: search.Name, $options: 'i' } }
            ];
        }

        const contactsData: IContacts[] = await ContactsModel.find(filter).lean();

        if (!contactsData || contactsData.length === 0) {
            response.setWarning("No se encontraron contactos");
            return response;
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedContacts = contactsData.slice(startIndex, endIndex);

        response.Items = paginatedContacts.map((s: IContacts): IPagedListContact => ({
            id: s.id,
            status: s.status,
            fullName: `${s.name} ${s.lastName}`,
            phone: s.phone,
            reference: s.reference,
            contactMedia: s.contactMedia,
            firstContactDate: s.createDate as string
        }));

        response.TotalItems = contactsData.length;
        response.PageSize = limit;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo contactos:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const changeStatusContactRepository = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsModel = getContactsModel(companyName);

        // Buscar contacto por id
        const contact = await ContactsModel.findOne({ id: changeStatus.id }).lean();

        if (!contact) {
            throw new Error("No se encontró el contacto");
        }

        const updateFields: Partial<IContacts> = {
            status: changeStatus.newStatus,
            idReason: changeStatus.reasonId,
            observationsInactive: changeStatus.observation,
        };

        if (changeStatus.newStatus === "inactivo") {
            // Remover contacto de las clases asociadas
            if (contact.classes && contact.classes.length > 0) {
                for (const classe of contact.classes) {
                    await removeStudentToClassRepository(classe, changeStatus.id);
                }
            }
            updateFields.classes = [];
            updateFields.inactiveDate = format(new Date(), "full");
        }

        // Actualizar en Mongo
        await ContactsModel.updateOne({ id: changeStatus.id }, { $set: updateFields });

        response.setSuccess("Contacto actualizado correctamente");
    } catch (error: any) {
        console.error("Error actualizando contacto:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const getContactByIdRepository = async (id: string): Promise<IContacts> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return {} as IContacts;

        const ContactsModel = getContactsModel(companyName);

        // Buscar contacto por id
        const contact = await ContactsModel.findOne({ id }).lean();


        if (!contact || !contact.name || !contact.lastName) {
            return {} as IContacts
        }

        return contact;
    } catch (error: any) {
        console.error("Error obteniendo contacto:", error);
        throw new Error(error.message || "No se encontró el contacto");
    }
};

export const getContactsByStatusRepository = async (status: string): Promise<IContacts[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!status) return [];

        const ContactsModel = getContactsModel(companyName);

        // Buscar contactos por status y ordenar por nombre
        const contactsByStatus = await ContactsModel.find({ status }).sort({ name: 1 }).lean();

        return contactsByStatus || [];
    } catch (error: any) {
        console.error("Error obteniendo contactos por estado:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


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