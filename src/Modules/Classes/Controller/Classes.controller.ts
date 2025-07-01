import { Request, Response } from "express";
import { Classes, OptionsFormClasse } from "../Models/classes.models";
import { mapStatus } from "../../Others/Helpers/Maps/MapStatus";
import { SearchClasses } from "../Models/search";
import { changeClassStatusService, changeJuvetActivityStatusService, getClasseByIdService, getClassesService, getJuvetActivityByIdService, getOptionsFormClasseService, getPagedListClassesService, getPagedListJuvetActivitiesService, removeStudentFromClassService, saveClasseService, saveJuvetActivityService } from "../Service/Classes.service";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { PagedListClasses, SearchPagedListClasses } from "../Models/classes-paged-list-models";
import { PagedListJuvetActivities, SearchPagedListJuvetActivities } from "../Models/juvet-activites-paged-list.model";
import { ActivitiesResponse } from "../../Activities/Models/Activities.models";

export const getClasses = async (req: Request, res: Response): Promise<void> => {
    const { status, page, limit } = req.query;
    try {
        const statusString = mapStatus(Number(status));
        const search = new SearchPagedListClasses();
        search.Status = statusString ? statusString : "";
        if (page) search.Page = Number(page);
        const response = await getClassesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new Classes();
        response.setError(error.message);
        res.status(500).send(response);
    }
};

export const getClasseById = async (req: Request, res: Response): Promise<void> => {
    const { classeId } = req.query;
    try {
        if (!classeId) throw new Error('Los campos son requeridos');
        const response = await getClasseByIdService(classeId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Classes();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const removeStudentFromClass = async (req: Request, res: Response): Promise<void> => {
    const { studentId, classId, type } = req.query
    try {
        if (!studentId || !type || !classId) throw new Error('Los campos son requeridos');
        const response = await removeStudentFromClassService(classId as string, studentId as string, type as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListClasses = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page } = req.query
    try {
        const search = new SearchPagedListClasses()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        const response = await getPagedListClassesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListClasses()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeClassStatus = async (req: Request, res: Response): Promise<void> => {
    const { classeId, status } = req.query;
    try {
        if (!classeId || !status) throw new Error('Los campos son requeridos');
        const response = await changeClassStatusService(classeId as string, status as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getOptionsFormClasse = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormClasseService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormClasse();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveClasse = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const classe = req.body;
    try {
        if (!classe) throw new Error('Los campos son requeridos');
        response = await saveClasseService(classe);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListJuvetActivities = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page } = req.query
    try {
        const search = new SearchPagedListJuvetActivities()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        const response = await getPagedListJuvetActivitiesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListJuvetActivities()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeJuvetActivityStatus = async (req: Request, res: Response): Promise<void> => {
    const { activityId, status } = req.query;
    try {
        if (!activityId || !status) throw new Error('Los campos son requeridos');
        const response = await changeJuvetActivityStatusService(activityId as string, status as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getJuvetActivityById = async (req: Request, res: Response): Promise<void> => {
    const { activityId } = req.query;
    try {
        if (!activityId) throw new Error('Los campos son requeridos');
        const response = await getJuvetActivityByIdService(activityId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ActivitiesResponse();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const saveJuvetActivity = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const activity = req.body;
    try {
        if (!activity) throw new Error('Los campos son requeridos');
        response = await saveJuvetActivityService(activity);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}
