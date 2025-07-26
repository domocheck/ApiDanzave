import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getLimit, getReferencesFromConfigRepository, getUsersFromConfigRepository } from "../../Config/Repository/Config.repository";
import { ActivityToTable, IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getContactByIdRepository, getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { checkStatusActivity } from "../Helpers/Contacts-activities.helpers";
import { PagedListContactsActivities, SearchContactsActivities } from "../Models/Contacts-activities-paged-list.models";
import { getContactById } from "../../Contacts/Controller/Contacts.controller";

export const getContactsActivitiesRepository = async (): Promise<IContactsActivities[]> => {
    let response: IContactsActivities[] = []
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let contactsActivities: IContactsActivities[] = docSnap.docs.map((doc) => doc.data() as IContactsActivities)

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
        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities")
            .where("contactId", "==", contactId);


        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let contactsActivities: IContactsActivities[] = docSnap.docs.map((doc) => doc.data() as IContactsActivities)

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
        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities")
            .where("id", "==", activityId);


        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let contactsActivities: IContactsActivities = docSnap.docs.map((doc) => doc.data() as IContactsActivities)[0]

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

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const activitiesRef = db
            .collection(companyName)
            .doc("zContactsActivities")
            .collection("activities")
            .doc(activity.id); // Asegúrate de que movement.id esté definido y sea único

        await activitiesRef.set(activity);

        response.setSuccess("contacto guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando contacto:", error);
        response.setError(error.message);
    }

    return response;

}

export const fulfillActivityRepository = async (activityId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages()
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities").doc(activityId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }
        await docRef.update({
            fulfillDate: format(new Date(), 'full')
        });
        response.setSuccess("Actividad cumplida correctamente");
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
        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities")
            .where("fulfillDate", "==", null)
            .orderBy("id");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        const references = await getReferencesFromConfigRepository()
        const users = await getUsersFromConfigRepository()

        const activities = docSnap.docs.map((doc) => doc.data() as IContactsActivities)

        let uniquePersonIds = Array.from(new Set(activities.map((m) => m.contactId)));
        let contactsPromise = uniquePersonIds.map(async (id) => await getContactByIdRepository(id));
        let contacts = await Promise.all(contactsPromise);

        // Crear un array de promesas
        let activitiesData = activities
            .map((ca: IContactsActivities) => {
                const contact = contacts.find((c) => c.id === ca.contactId)!;
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

        const docRef = db.collection(companyName).doc("zContactsActivities").collection("activities").doc(activityId);

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        await docRef.update({
            userId: userToAssignId
        });

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}