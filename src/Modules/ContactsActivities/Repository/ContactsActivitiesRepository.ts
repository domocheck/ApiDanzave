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
import { getContactsActivitiesModel } from "../../../mongo/schemas/contactsActivities.schema";
import { convertirFechaInglesAEspanol, formatDateToDate } from "../../Others/Helpers/FormatDateToDate";

export const getContactsActivitiesRepository = async (): Promise<IContactsActivities[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        // Obtener todas las actividades de contactos
        const contactsActivities = await ContactsActivitiesModel.find().lean();

        return contactsActivities as IContactsActivities[];
    } catch (error: any) {
        console.error("Error obteniendo actividades de contactos:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const getContactActivitiesByContactIdRepository = async (contactId: string): Promise<IContactsActivities[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        // Buscar actividades del contacto específico
        const contactsActivities = await ContactsActivitiesModel.find({ contactId }).lean();

        return contactsActivities as IContactsActivities[];
    } catch (error: any) {
        console.error("Error obteniendo actividades de contacto:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const getContactActivitiesByActivityIdRepository = async (
    activityId: string
): Promise<IContactsActivities> => {
    let response: IContactsActivities = {} as IContactsActivities;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        const contactActivity = await ContactsActivitiesModel.findOne({ id: activityId }).lean<IContactsActivities>();

        if (!contactActivity) return response;

        response = contactActivity;
        return response;
    } catch (error: any) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const saveActivityRepository = async (
    activity: IContactsActivities
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);
        activity.dateFormat = formatDateToDate(activity.nextContactDate as string);
        // Actualiza si existe o crea un nuevo documento
        await ContactsActivitiesModel.updateOne(
            { id: activity.id },
            { $set: activity },
            { upsert: true }
        );

        response.setSuccess("Actividad guardada con éxito");
    } catch (error: any) {
        console.error("Error guardando actividad:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};

export const updateActivitiesWithDateFormatRepository = async (): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = 'Juvet';
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        // Obtener todas las actividades
        const activities = await ContactsActivitiesModel.find().lean();

        if (!activities.length) {
            response.setWarning("No se encontraron actividades para actualizar");
            return response;
        }

        let updatedCount = 0;

        // Procesar cada actividad
        for (const act of activities) {
            const { nextContactDate, dateCreated, updateDate } = act;

            // Intenta parsear en orden de prioridad
            const parsedDate =
                formatDateToDate(nextContactDate as string)

            console.log(parsedDate)

            if (!parsedDate) continue; // si no se puede parsear, la omitimos

            await ContactsActivitiesModel.updateOne(
                { id: act.id },
                { $set: { DateFormat: parsedDate } }
            );

            updatedCount++;
        }

        response.setSuccess(`Se actualizaron ${updatedCount} actividades con DateFormat`);
    } catch (error: any) {
        console.error("Error actualizando actividades:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const fulfillActivityRepository = async (
    activityId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        const result = await ContactsActivitiesModel.updateOne(
            { id: activityId },
            { $set: { fulfillDate: format(new Date(), "full") } }
        );

        if (result.matchedCount === 0) {
            throw new Error("No se encontró la actividad");
        }

        response.setSuccess("Actividad cumplida correctamente");
    } catch (error: any) {
        console.error("Error cumpliendo la actividad:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const getPagedListContactsActivitiesRepository = async (
    search: SearchContactsActivities
): Promise<PagedListContactsActivities> => {
    const response = new PagedListContactsActivities();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtenemos el modelo pasando el companyName
        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        // Filtro base: solo actividades no cumplidas
        let filter: any = { fulfillDate: null };

        // Paginación
        const page = search.Page;
        const limit = await getLimit();
        const skip = (page - 1) * limit;

        // Traemos los documentos paginados
        let activities = await ContactsActivitiesModel.find(filter)
            .sort({ DateFormat: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (!activities || activities.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        // Obtener referencias y usuarios
        const references = await getReferencesFromConfigRepository();
        const users = await getUsersFromConfigRepository();

        // Obtener contactos relacionados
        const uniquePersonIds = Array.from(new Set(activities.map(a => a.contactId)));
        const contactsPromise = uniquePersonIds.map(async (id) => await getContactByIdRepository(id));
        const contacts = await Promise.all(contactsPromise);

        // Mapear datos de actividades
        let activitiesData = activities.map((ca: IContactsActivities) => {
            const contact = contacts.find(c => c?.id === ca.contactId);
            const status = checkStatusActivity(ca);
            return {
                activityId: ca.id,
                contactId: contact?.id ?? 'falta dato',
                name: contact?.name ?? 'falta dato',
                lastName: contact?.lastName ?? 'falta dato',
                phone: contact?.phone ?? 'Sin numero de telefono.',
                interest: contact?.interest ?? 'falta dato',
                activity: ca.result,
                nextContactDate: ca.nextContactDate?.toString() ?? 'Sin fecha',
                status,
                reference: references.find(r => r.id === contact?.reference)?.name ?? 'Sin referencia',
                userId: ca.userId,
            };
        });

        // Aplicar filtros de búsqueda
        if (search.Status && search.Status !== 'all') {
            if (search.Status === 'toComplete') {
                activitiesData = activitiesData.filter(a => a.status?.toLowerCase() === 'vencida' || a.status?.toLowerCase() === 'en peligro');
            }
            if (search.Status === 'warning') {
                activitiesData = activitiesData.filter(a => a.status?.toLowerCase() === 'vencida');
            }
            if (search.Status === 'danger') {
                activitiesData = activitiesData.filter(a => a.status?.toLowerCase() === 'en peligro');
            }
            if (search.Status === 'ok') {
                activitiesData = activitiesData.filter(a => a.status?.toLowerCase() === 'sin vencer');
            }
        }

        if (search.Activity) {
            if (search.Activity === 'follow') {
                activitiesData = activitiesData.filter(a => a.activity?.toLowerCase() === 'seguimiento');
            }
            if (search.Activity === 'proofClass') {
                activitiesData = activitiesData.filter(a => a.activity?.toLowerCase() === 'clase de prueba');
            }
        }

        if (search.Name) {
            activitiesData = activitiesData.filter(a =>
                a.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                a.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        if (search.Interest) {
            if (search.Interest === 'low') activitiesData = activitiesData.filter(a => a.interest?.toLowerCase() === 'bajo');
            if (search.Interest === 'medium') activitiesData = activitiesData.filter(a => a.interest?.toLowerCase() === 'medio');
            if (search.Interest === 'high') activitiesData = activitiesData.filter(a => a.interest?.toLowerCase() === 'alto');
        }

        if (search.Reference) {
            activitiesData = activitiesData.filter(a => a.reference === search.Reference);
        }

        if (search.User) {
            activitiesData = activitiesData.filter(a => a.userId === search.User);
        }

        // Mapear a respuesta final
        response.Items = activitiesData.map((s: any) => ({
            id: s.activityId,
            status: s.status,
            fullName: `${s.name} ${s.lastName}`,
            phone: s.phone,
            interest: s.interest,
            activity: s.activity,
            reference: s.reference,
            nextContactDate: format(s.DateFormat, 'full'),
            user: users.find(u => u.id === s.userId)?.name || 'sin usuario',
            contactId: s.contactId
        }));

        response.TotalItems = activities.length;
        response.ReferenceFilter = references.map(r => ({ id: r.id, name: r.name }));
        response.PageSize = limit;
        response.UserFilter = users.map(u => ({ id: u.id, name: u.name }));

        return response;

    } catch (error) {
        console.error("Error obteniendo actividades:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};


export const assignActivityRepository = async (
    userToAssignId: string,
    activityId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtener el modelo de actividades
        const ContactsActivitiesModel = getContactsActivitiesModel(companyName);

        // Actualizar la actividad
        const result = await ContactsActivitiesModel.updateOne(
            { id: activityId },
            { $set: { userId: userToAssignId } }
        );

        if (result.matchedCount === 0) {
            throw new Error("No se encontró la actividad");
        }

        response.setSuccess("Actividad asignada correctamente");

    } catch (error: any) {
        console.error("Error asignando actividad:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};
