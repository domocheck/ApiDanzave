import { Request, Response } from "express";
import { PagedListContacts, SearchPagedListContacts } from "../Models/Contacts-paged-list.modelst";
import { changeStatusContactService, getContactByIdService, getOptionsFormContactService, getPagedListContactsService, saveContactService } from "../Service/Contacts.service";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { Contacts, OptionsFormContact } from "../Models/Contact.models";

export const getPagedListContacts = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page } = req.query
    try {
        const search = new SearchPagedListContacts()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        const response = await getPagedListContactsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListContacts()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeStatusContact = async (req: Request, res: Response): Promise<void> => {
    const { contactId, status, reasonId, observation } = req.query;
    try {
        if (!contactId || !status) throw new Error('Los campos son requeridos');
        const response = await changeStatusContactService({ id: contactId as string, newStatus: status as string, reasonId: reasonId as string, observation: observation as string });
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getContactById = async (req: Request, res: Response): Promise<void> => {
    const { contactId } = req.query;
    try {
        if (!contactId) throw new Error('Los campos son requeridos');
        const response = await getContactByIdService(contactId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Contacts();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const saveContact = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const { contact, userId } = req.body;
    try {
        if (!contact) throw new Error('Los campos son requeridos');
        response = await saveContactService(contact, userId as string);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getOptionsFormContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormContactService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormContact();
        response.setError(error.message);
        res.status(500).send(response);
    }
}