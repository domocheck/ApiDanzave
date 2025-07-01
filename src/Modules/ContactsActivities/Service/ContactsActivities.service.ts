import { format } from "@formkit/tempo";
import { ActivityInd, IContacts, IContactsActivities, UpdateActivity, UpdateActivityResponse } from "../../Contacts/Models/Contact.models";
import { getFullNameUserIdById } from "../../Users/Repository/User.repository";
import { HistoryActivities } from "../Models/History-actibities";
import { assignActivityRepository, fulfillActivityRepository, getContactActivitiesByActivityIdRepository, getContactActivitiesByContactIdRepository, getPagedListContactsActivitiesRepository, saveActivityRepository } from "../Repository/ContactsActivitiesRepository";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../../Others/Models/Users";
import { PagedListContactsActivities, SearchContactsActivities } from "../Models/Contacts-activities-paged-list.models";
import { Activity } from "../../Activities/Models/Activities.models";
import { getContactByIdRepository, saveContactRepository } from "../../Contacts/Repository/Contacts.repository";
import { addStudentToClassRepository, checkIsPersonOnClasseRepository, getClassesByStatusRepository, getClassesGropuedRepository, removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getPaymentsMethods } from "../../Config/Controller/Config.controller";
import { getPaymentsMethodsFromConfigRepository, getUsersFromConfigRepository } from "../../Config/Repository/Config.repository";
import { getMovementByIdRepository, getMovementByPersonIdRepository } from "../../Drawers/Repository/Drawer.repository";
import { removeStudentFromClass } from "../../Classes/Controller/Classes.controller";
import { removeStudentFromClassService } from "../../Classes/Service/Classes.service";
import { convertedContactToStudentService } from "../../Students/Service/Students.service";
import { getPreviousDayBeforeNextTargetDay } from "../Helpers/Contacts-activities.helpers";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";


export const getObservationsByContactIdService = async (contactId: string): Promise<HistoryActivities> => {
    let response = new HistoryActivities();
    const activities = await getContactActivitiesByContactIdRepository(contactId);
    response.History = await Promise.all(activities.map(async (act: IContactsActivities) => {
        return {
            activityId: act.id,
            observation: act.observations,
            dateCreate: act.updateDate.toString(),
            userId: act.userId,
            userName: await getFullNameUserIdById(act.userId)
        };
    }));
    return response;

}

export const generateActivity = (newContact: IContacts, userId: string): IContactsActivities => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    return {
        id: uuidv4(),
        contactId: newContact.id,
        observations: newContact.observations || 'Contacto creado',
        dateCreated: format(today, 'full'),
        updateDate: format(today, 'full'),
        nextContactDate: format(nextDay, 'full'),
        fulfillDate: null,
        result: 'Seguimiento',
        status: null,
        userId
    };
}

export const getPagedListContactsActivitiesService = async (search: SearchContactsActivities): Promise<PagedListContactsActivities> => {
    return await getPagedListContactsActivitiesRepository(search)
}

export const getActivityByIdService = async (activityId: string): Promise<ActivityInd> => {
    let response = new ActivityInd();
    try {
        const activity = await getContactActivitiesByActivityIdRepository(activityId)
        if (!activity) {
            throw new Error('No se encontro la actividad');
        }

        const [
            contact,
            history,
            classesActives,
            paymentMethods,
            movement,
            usersActives
        ] = await Promise.all([
            getContactByIdRepository(activity.contactId),
            getObservationsByContactIdService(activity.contactId),
            getClassesGropuedRepository(),
            getPaymentsMethodsFromConfigRepository(),
            getMovementByPersonIdRepository(activity.contactId),
            getUsersFromConfigRepository()
        ])

        response.Activity = activity;
        response.Contact = contact;
        response.History = history.History;
        response.ClassesActives = classesActives;
        response.PaymentsMethods = paymentMethods;
        response.Movement = movement.filter(m => m.description === 'Cobro clase de prueba')[0]
        response.UsersActives = usersActives.map(u => (
            {
                id: u.id,
                name: u.name
            }
        ))

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;

}

export const updateActivityService = async (updateActivity: UpdateActivity): Promise<UpdateActivityResponse> => {
    let response = new UpdateActivityResponse();
    try {

        if (updateActivity.Result === 'Seguimiento') {
            await generateNewAct(updateActivity.Result, updateActivity.Observations!, updateActivity.NextContact!, null, updateActivity.ContactId, updateActivity.UserId!, updateActivity.ActivityId);
            response.setSuccess('Actividad actualizada');
            return response;
        }

        if (updateActivity.Result === 'Cierre') {
            const res = await fulfillActivityRepository(updateActivity.ActivityId);
            response.setSuccess(res.getSuccess()[0]);
            return response;
        }

        if (updateActivity.Result === 'Se convierte en alumno') {
            await convertedContactToStudentService(updateActivity.ContactId!, updateActivity.ActivityId!, updateActivity.Observations);
            response.setSuccess('Actividad actualizada');
            response.Response = 'newStudent';
            response.ContactId = updateActivity.ContactId;
            response.ActivityId = updateActivity.ActivityId;
            return response;
        }

        if (updateActivity.Result === 'Clase de prueba') {
            if (updateActivity.Status === 'Se convierte en alumno') {
                await convertedContactToStudentService(updateActivity.ContactId!, updateActivity.ActivityId!, updateActivity.Observations);
                response.setSuccess('Actividad actualizada');
                response.Response = 'newStudent';
                response.ContactId = updateActivity.ContactId;
                response.ActivityId = updateActivity.ActivityId;
                return response;
            }

            if (updateActivity.Status === 'No va a venir y cerrar') {
                const contact = await getContactByIdRepository(updateActivity.ContactId);
                if (contact.classes && contact.classes.length > 0) {
                    for (let classe of contact.classes) {
                        await removeStudentToClassRepository(classe, contact.id);
                    }
                }
                const updateContact = {
                    ...contact,
                    status: 'inactivo',
                };
                await saveContactRepository(updateContact);
                const res = await fulfillActivityRepository(updateActivity.ActivityId);
                response.setSuccess(res.getSuccess()[0]);
                return response;
            }

            if (updateActivity.Status === 'Va a venir y seguirlo') {
                const isContactOnClasse = await checkIsPersonOnClasseRepository(updateActivity.Classe!, updateActivity.ContactId!);
                if (!isContactOnClasse) {
                    await addStudentToClassRepository(updateActivity.Classe!, updateActivity.ContactId!);
                }
                await generateNewAct(updateActivity.Result, updateActivity.Observations!, updateActivity.NextContact!, updateActivity.Status, updateActivity.ContactId, updateActivity.UserId!, updateActivity.ActivityId);
                response.setSuccess('Actividad actualizada');
                return response;
            }

            if (updateActivity.Status === 'No va a venir y seguirlo') {
                const contact = await getContactByIdRepository(updateActivity.ContactId);
                if (contact.classes && contact.classes.length > 0) {
                    for (let classe of contact.classes) {
                        await removeStudentToClassRepository(classe, contact.id);
                    }
                }
                await generateNewAct(updateActivity.Result, updateActivity.Observations!, updateActivity.NextContact!, updateActivity.Status, updateActivity.ContactId, updateActivity.UserId!, updateActivity.ActivityId);
                response.setSuccess('Actividad actualizada');
                return response;
            }

            if (updateActivity.Status === 'Seguirlo') {
                const contact = await getContactByIdRepository(updateActivity.ContactId);
                const classesActives = await getClassesGropuedRepository();

                await addStudentToClassRepository(updateActivity.Classe!, contact.id);

                contact.proofClassDate = format(new Date(), 'full');
                const updateContact = {
                    ...contact,
                    classes: [updateActivity.Classe!],
                };
                const dayClasse = classesActives.find((c) => c.id === updateActivity.Classe)?.numberDay;
                const nextContact = getPreviousDayBeforeNextTargetDay(+dayClasse!);

                await saveContactRepository(updateContact);
                await fulfillActivityRepository(updateActivity.ActivityId);
                await generateNewAct(updateActivity.Result, updateActivity.Observations!, nextContact, updateActivity.Status, updateActivity.ContactId, updateActivity.UserId!, updateActivity.ActivityId);
                response.setSuccess('Actividad actualizada');
                return response;
            }
        }


    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const assignActivityService = async (userToAssignId: string, activityId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        response = await assignActivityRepository(userToAssignId, activityId);
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response;
}

const generateNewAct = async (result: string,
    observations: string,
    nextContact: number | string,
    status: string | null = null,
    contactId: string,
    userId: string,
    activityId: string
): Promise<void> => {
    const today = new Date();
    const nextDay = new Date(nextContact);

    const newAct: IContactsActivities = {
        id: uuidv4(),
        contactId: contactId,
        observations,
        dateCreated: format(today, 'full'),
        updateDate: format(today, 'full'),
        nextContactDate: format(nextDay, 'full'),
        fulfillDate: null,
        result,
        status,
        userId: userId
    };

    const res = await fulfillActivityRepository(activityId);
    if (res.hasErrors()) {
        return;
    }
    await saveActivityRepository(newAct)
}