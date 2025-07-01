import { Request, Response } from "express";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { chargePresencesService, createAssistService, generatePresenceService, getAssistByActivityIdService, getAssistByClassIdService, getHistoryContactAssistService, getHistoryStudentAssistService, getHistoryTeacherAssistService } from "../Service/Assists.service";
import { IndClassInfo, PresenceAssist } from "../../Classes/Models/classes.models";
import { AssistPerson, HistoryAssistsTeacher } from "../Models/Assists.models";
import { IndActivityInfo } from "../../Activities/Models/Activities.models";
import { PagedListHistoryAssistsPersons, SearchPagedListHistoryAssistsPersons } from "../Models/Assists.-students-paged-list.model";

export const createAssists = async (req: Request, res: Response): Promise<void> => {
    const { classesId } = req.query;
    try {
        if (!classesId) throw new Error('No se encontraron clases');
        const idClasses = String(classesId).split(',');
        const response = await createAssistService(idClasses);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getIdAssistByClassId = async (req: Request, res: Response): Promise<void> => {
    const { classId } = req.query;
    try {
        if (!classId) {
            throw new Error('No se encontraron clases');
        }
        const response = await getAssistByClassIdService(classId as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new IndClassInfo();
        response.setError(error.message);
        res.status(500).send(response);
    }
};

export const getIdAssistByActivityId = async (req: Request, res: Response): Promise<void> => {
    const { activityId } = req.query;
    try {
        if (!activityId) {
            throw new Error('No se encontraron clases');
        }
        const response = await getAssistByActivityIdService(activityId as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new IndActivityInfo();
        response.setError(error.message);
        res.status(500).send(response);
    }
};

export const generatePresence = async (req: Request, res: Response): Promise<void> => {
    const { idClass, idAssist, typeClasse } = req.query;

    try {
        if (!idClass || !idAssist || !typeClasse) throw new Error('Los campos son obligatorios');
        const response = await generatePresenceService(idClass as string, idAssist as string, Number(typeClasse));
        res.status(200).send(response);
    } catch (error: any) {
        const response = new PresenceAssist();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const chargePresences = async (req: Request, res: Response): Promise<void> => {
    try {
        const assists = req.body;
        const response = await chargePresencesService(assists as AssistPerson);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getHistoryStudentAssist = async (req: Request, res: Response): Promise<void> => {
    const { personId, page, assist } = req.query;
    try {
        const search: SearchPagedListHistoryAssistsPersons = {
            PersonId: personId as string,
            Page: Number(page),
            Assist: assist as string
        }
        const response = await getHistoryStudentAssistService(search);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new PagedListHistoryAssistsPersons();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getHistoryTeacherAssist = async (req: Request, res: Response): Promise<void> => {
    const { personId, page, assist } = req.query;
    try {
        const search: SearchPagedListHistoryAssistsPersons = {
            PersonId: personId as string,
            Page: Number(page),
            Assist: assist as string
        }
        const response = await getHistoryTeacherAssistService(search);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new PagedListHistoryAssistsPersons();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getHistoryContactAssist = async (req: Request, res: Response): Promise<void> => {
    const { personId, page, assist } = req.query;
    try {
        const search: SearchPagedListHistoryAssistsPersons = {
            PersonId: personId as string,
            Page: Number(page),
            Assist: assist as string
        }
        const response = await getHistoryContactAssistService(search);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new PagedListHistoryAssistsPersons();
        response.setError(error.message);
        res.status(500).send(response);
    }
}
