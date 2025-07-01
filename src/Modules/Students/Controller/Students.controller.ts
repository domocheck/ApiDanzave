import { Request, Response } from "express";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { addRecoverStudentService, changeStatusStudentService, getOptionsFormStudentService, getPagedListStudentsService, getStudentByIdService, getStudentsActivesService, saveStudentService } from "../Service/Students.service";
import { OptionsFormStudent, PagedListStudents, Students, StudentsActivesResponse } from "../Models/Students.models";
import { SearchPagedListStudents } from "../Models/Search";
import { PagedListUnpaidAccounts } from "../../Accounts/Models/Accounts-paged-list.models";

export const addRecoverStudent = async (req: Request, res: Response): Promise<void> => {
    const { studentId, assistId } = req.query;
    try {
        if (!studentId || !assistId) throw new Error('Los campos son requeridos');
        const response = await addRecoverStudentService(studentId as string, assistId as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getPagedListStudents = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page, isCareerStudent } = req.query

    try {
        const search = new SearchPagedListStudents()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        search.IsCareerStudent = (isCareerStudent === 'true');
        const response = await getPagedListStudentsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListStudents()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const changeStatusStudent = async (req: Request, res: Response): Promise<void> => {
    const { studentId, status, reasonId, observation } = req.query;
    try {
        if (!studentId || !status) throw new Error('Los campos son requeridos');
        const response = await changeStatusStudentService({ id: studentId as string, newStatus: status as string, reasonId: reasonId as string, observation: observation as string });
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getOptionsFormStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormStudentService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormStudent();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveStudent = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const student = req.body;
    try {
        if (!student) throw new Error('Los campos son requeridos');
        response = await saveStudentService(student);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.query;
    try {
        if (!studentId) throw new Error('Los campos son requeridos');
        const response = await getStudentByIdService(studentId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Students();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getStudentsActives = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getStudentsActivesService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new StudentsActivesResponse();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

