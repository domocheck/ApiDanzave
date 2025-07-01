import { Request, Response } from "express";
import { HistoryActivities } from "../Models/History-actibities";
import { assignActivityService, getActivityByIdService, getObservationsByContactIdService, getPagedListContactsActivitiesService, updateActivityService } from "../Service/ContactsActivities.service";
import { PagedListContactsActivities, SearchContactsActivities } from "../Models/Contacts-activities-paged-list.models";
import { ActivityInd, UpdateActivityResponse } from "../../Contacts/Models/Contact.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export const getObservationsByContactId = async (req: Request, res: Response): Promise<void> => {
    const { contactId } = req.query;
    try {
        if (!contactId) throw new Error('El id es requerido');
        const response = await getObservationsByContactIdService(contactId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new HistoryActivities();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListContactsActivities = async (req: Request, res: Response): Promise<void> => {
    const { name, page, status, activity, interest, reference, user } = req.query;
    try {
        const search: SearchContactsActivities = {
            Name: name as string,
            Page: Number(page),
            Status: status as string,
            Activity: activity as string,
            Interest: interest as string,
            Reference: reference as string,
            User: user as string
        }
        const reponse = await getPagedListContactsActivitiesService(search);
        res.status(200).send(reponse);
    } catch (error: any) {
        let response = new PagedListContactsActivities()
        response.setError(error.message)
        res.status(500).send(response)
    }

}

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
    let { activityId } = req.query;
    try {
        const response = await getActivityByIdService(activityId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ActivityInd();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
    const updateActivity = req.body;
    try {
        const response = await updateActivityService(updateActivity);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new UpdateActivityResponse();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const assignActivity = async (req: Request, res: Response): Promise<void> => {
    let { userToAssignId, activityId } = req.query;
    try {
        const response = await assignActivityService(userToAssignId as string, activityId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}
