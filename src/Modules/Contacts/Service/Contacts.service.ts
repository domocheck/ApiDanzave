import { getClassesGropuedRepository } from "../../Classes/Repository/Classes.repository";
import { checkAndSaveContactMedia, checkAndSaveReference, getContactsMediaFromConfigRepository, getReferencesFromConfigRepository } from "../../Config/Repository/Config.repository";
import { saveActivityRepository } from "../../ContactsActivities/Repository/ContactsActivitiesRepository";
import { generateActivity } from "../../ContactsActivities/Service/ContactsActivities.service";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { Contacts, IContacts, OptionsFormContact } from "../Models/Contact.models";
import { ChangeStatusPerson, PagedListContacts, SearchPagedListContacts } from "../Models/Contacts-paged-list.modelst";
import { v4 as uuidv4 } from 'uuid';
import { changeStatusContactRepository, getContactByIdRepository, getPagedListContactsRepository, saveContactRepository } from "../Repository/Contacts.repository";

export const getPagedListContactsService = async (search: SearchPagedListContacts): Promise<PagedListContacts> => {
    return await getPagedListContactsRepository(search);
}

export const changeStatusContactService = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    return await changeStatusContactRepository(changeStatus);
}

export const getContactByIdService = async (contactId: string): Promise<Contacts> => {
    let response = new Contacts();
    const student = await getContactByIdRepository(contactId);
    response.Items = [student];
    return response;
}

export const saveContactService = async (contact: IContacts, userId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const isNewContact = !contact.id || contact.id === '';
        if (isNewContact) {
            contact.id = uuidv4();
        }
        const [contactMedia, reference] = await Promise.all([
            checkAndSaveContactMedia(contact.contactMedia),
            checkAndSaveReference(contact.reference)
        ])
        contact.contactMedia = contactMedia.id;
        contact.reference = reference.id;

        response = await saveContactRepository(contact)

        if (response.hasErrors()) {
            return response;
        }

        if (isNewContact) {
            const newActivity = generateActivity(contact, userId)
            response = await saveActivityRepository(newActivity)
        }

        return response;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

}

export const getOptionsFormContactService = async (): Promise<OptionsFormContact> => {
    let response = new OptionsFormContact();
    try {

        const [contactMedia, reference, classesActives] = await Promise.all([
            getContactsMediaFromConfigRepository(),
            getReferencesFromConfigRepository(),
            getClassesGropuedRepository()
        ])
        response.ContactsMedia = contactMedia;
        response.References = reference;
        response.ClassesActives = classesActives;
        response.Interest = ['Bajo', 'Medio', 'Alto'];

        return response;

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
}