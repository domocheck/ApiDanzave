import { Request, Response } from "express";
import { OptionsFormTeacher, Substitutes, Teachers } from "../Models/Teachers.models";
import { changeStatusTeachersService, getOptionsFormTeacherService, getPagedListTeachersService, getSubstitutesService, getTeacherByIdService, saveTeacherService } from "../Service/Teachers.service";
import { PagedListTeachers, SearchPagedListTeachers } from "../Models/Teachers-paged-list.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export const getSubstitutes = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    try {
        if (!id) throw new Error('El id es requerido');
        const response = await getSubstitutesService(id as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new Substitutes();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getPagedListTeachers = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page } = req.query
    try {
        const search = new SearchPagedListTeachers()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        const response = await getPagedListTeachersService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListTeachers()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeStatusTeacher = async (req: Request, res: Response): Promise<void> => {
    const { teacherId, status, reasonId, observation } = req.query;
    try {
        if (!teacherId || !status) throw new Error('Los campos son requeridos');
        const response = await changeStatusTeachersService({ id: teacherId as string, newStatus: status as string, reasonId: reasonId as string, observation: observation as string });
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getTeacherById = async (req: Request, res: Response): Promise<void> => {
    const { teacherId } = req.query;
    try {
        if (!teacherId) throw new Error('Los campos son requeridos');
        const response = await getTeacherByIdService(teacherId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Teachers();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getOptionsFormTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormTeacherService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormTeacher();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveTeacher = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const teacher = req.body;
    try {
        if (!teacher) throw new Error('Los campos son requeridos');
        response = await saveTeacherService(teacher);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}