import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getLimit, getReferencesFromConfigRepository, getUsersFromConfigRepository } from "../../Config/Repository/Config.repository";
import { ActivityToTable, IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getContactByIdRepository } from "../../Contacts/Repository/Contacts.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { checkStatusActivity } from "../Helpers/Contacts-activities.helpers";
import { PagedListContactsActivities, SearchContactsActivities } from "../Models/Contacts-activities-paged-list.models";

export const getContactsActivitiesRepository = async (): Promise<IContactsActivities[]> => {
    let response: IContactsActivities[] = []
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("zContactsActivities");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let contactsActivities: IContactsActivities[] = docSnap.data()?.activities

        return contactsActivities;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getContactActivitiesByContactIdRepository = async (contactId: string): Promise<IContactsActivities[]> => {
    let response: IContactsActivities[] = []
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("zContactsActivities");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let contactsActivities: IContactsActivities[] = docSnap.data()?.activities.filter((act: IContactsActivities) => act.contactId === contactId)

        return contactsActivities;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getContactActivitiesByActivityIdRepository = async (activityId: string): Promise<IContactsActivities> => {
    let response: IContactsActivities = {} as IContactsActivities
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("zContactsActivities");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let contactsActivities: IContactsActivities = docSnap.data()?.activities.filter((act: IContactsActivities) => act.id === activityId)[0]
        return contactsActivities;

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const saveActivityRepository = async (activity: IContactsActivities): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zContactsActivities");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const activities: IContactsActivities[] = docSnap.data()?.activities ?? [];
        activities.unshift(activity);

        await docRef.update({ activities });
        response.setSuccess("Actividad creada correctamente");
    } catch (error: any) {
        response.setError(error.message);
        return response
    }

    return response;

}

export const fulfillActivityRepository = async (activityId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zContactsActivities");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const activities: IContactsActivities[] = docSnap.data()?.activities ?? [];
        const index = activities.findIndex((a: IContactsActivities) => a.id === activityId);

        if (index !== -1) {
            activities[index].fulfillDate = format(new Date(), 'full');
            await docRef.update({ activities });
            response.setSuccess("Actividad cumplida correctamente");
        }

    } catch (error: any) {
        response.setError(error.message);
        return response
    }

    return response;

}

export const getPagedListContactsActivitiesRepository = async (search: SearchContactsActivities): Promise<PagedListContactsActivities> => {
    let response = new PagedListContactsActivities();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("zContactsActivities");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron actividades");
            return response;
        }

        const references = await getReferencesFromConfigRepository()
        const users = await getUsersFromConfigRepository()

        // Crear un array de promesas
        const activitiesPromises = docSnap.data()?.activities
            .filter((act: IContactsActivities) => act.fulfillDate === null)
            .map(async (ca: IContactsActivities) => {
                const contact = await getContactByIdRepository(ca.contactId)
                const status = checkStatusActivity(ca)
                return {
                    activityId: ca.id,
                    contactId: contact ? contact.id : 'falta dato',
                    name: contact ? contact.name : 'falta dato',
                    lastName: contact ? contact.lastName : 'falta dato',
                    phone: contact ? contact.phone ?? 'Sin numero de telefono.' : 'falta dato',
                    interest: contact ? contact.interest : 'falta dato',
                    activity: ca.result,
                    nextContactDate: ca.nextContactDate?.toString() ?? 'Sin fecha',
                    status,
                    reference: references.find(r => r.id === contact.reference)?.name ?? 'Sin referencia',
                    userId: ca.userId,
                }
            });

        // Esperar a que todas las promesas se resuelvan
        let activitiesData: ActivityToTable[] = await Promise.all(activitiesPromises);

        if (!Array.isArray(activitiesData) || activitiesData.length === 0) {
            response.setError("No se encontraron actividades válidas");
            return response;
        }

        // Resto del código de filtrado...
        if (search.Status && search.Status !== 'all') {
            if (search.Status === 'toComplete') activitiesData = activitiesData.filter((item: ActivityToTable) => item.status?.toLowerCase() === 'vencida' || item.status?.toLowerCase() === 'en peligro');
            if (search.Status === 'warning') activitiesData = activitiesData.filter((item: ActivityToTable) => item.status?.toLowerCase() === 'vencida');
            if (search.Status === 'danger') activitiesData = activitiesData.filter((item: ActivityToTable) => item.status?.toLowerCase() === 'en peligro');
            if (search.Status === 'ok') activitiesData = activitiesData.filter((item: ActivityToTable) => item.status?.toLowerCase() === 'sin vencer');
        }

        if (search.Activity) {
            if (search.Activity === 'follow') activitiesData = activitiesData.filter((item: ActivityToTable) => item.activity?.toLowerCase() === 'seguimiento');
            if (search.Activity === 'proofClass') activitiesData = activitiesData.filter((item: ActivityToTable) => item.activity?.toLowerCase() === 'clase de prueba');
        }

        if (search.Name) {
            activitiesData = activitiesData.filter((item: ActivityToTable) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        if (search.Interest) {
            if (search.Interest === 'low') activitiesData = activitiesData.filter((item: ActivityToTable) => item.interest?.toLowerCase() === 'bajo');
            if (search.Interest === 'medium') activitiesData = activitiesData.filter((item: ActivityToTable) => item.interest?.toLowerCase() === 'medio');
            if (search.Interest === 'high') activitiesData = activitiesData.filter((item: ActivityToTable) => item.interest?.toLowerCase() === 'alto');
        }

        if (search.Reference) {
            activitiesData = activitiesData.filter((item: ActivityToTable) => item.reference === search.Reference);
        }

        if (search.User) {
            activitiesData = activitiesData.filter((item: ActivityToTable) => item.userId === search.User);
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedClasses = activitiesData.slice(startIndex, endIndex);

        response.Items = paginatedClasses.map((s: ActivityToTable) => {
            return {
                id: s.activityId,
                status: s.status,
                fullName: `${s.name} ${s.lastName}`,
                phone: s.phone,
                interest: s.interest,
                activity: s.activity,
                reference: s.reference,
                nextContactDate: s.nextContactDate,
                user: users.find(u => u.id === s.userId)?.name || 'sin usuario',
                contactId: s.contactId
            }
        })
        response.TotalItems = activitiesData.length;
        response.ReferenceFilter = references.map(r => ({
            id: r.id,
            name: r.name
        }));
        response.PageSize = limit;
        response.UserFilter = users.map(u => ({
            id: u.id,
            name: u.name
        }))
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const assignActivityRepository = async (userToAssignId: string, activityId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zContactsActivities");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const activities: IContactsActivities[] = docSnap.data()?.activities ?? [];
        const index = activities.findIndex((a: IContactsActivities) => a.id === activityId);

        if (index !== -1) {
            activities[index].userId = userToAssignId;
            await docRef.update({ activities });
            response.setSuccess("Actividad asignada correctamente");
        }

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}