import { Request, Response } from "express"
import { PagedListUsers, SearchPagedListUsers } from "../Models/Users-paged-list.model"
import { changeUserStatusService, getOptionsFormUsersService, getPagedListUsersService, getUserByIdService, saveUserService } from "../Service/User.service"
import { OptionsFormUsers, UsersResponse } from "../../Others/Models/Users"
import { ResponseMessages } from "../../Others/Models/ResponseMessages"

export const getPagedListUsers = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page } = req.query
    try {
        const search = new SearchPagedListUsers()
        search.Name = name as string,
            search.Status = status as string,
            search.Page = Number(page)
        const response = await getPagedListUsersService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListUsers()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;
    try {
        if (!userId) throw new Error('Los campos son requeridos');
        const response = await getUserByIdService(userId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new UsersResponse();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const changeUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;
    try {
        if (!userId) throw new Error('Los campos son requeridos');
        const response = await changeUserStatusService(userId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getOptionsFormUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getOptionsFormUsersService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new OptionsFormUsers();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const saveUser = async (req: Request, res: Response): Promise<void> => {
    let response = new ResponseMessages();
    const user = req.body;
    try {
        if (!user) throw new Error('Los campos son requeridos');
        response = await saveUserService(user);
        res.status(200).send(response);
    } catch (error: any) {
        response.setError(error.message);
        res.status(500).send(response);
    }
}