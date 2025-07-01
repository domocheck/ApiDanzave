import { getRolesFromConfigRepository } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { OptionsFormUsers, User, UsersResponse } from "../../Others/Models/Users";
import { getTeachersActives } from "../../Teachers/Repository/Teachers.repository";
import { PagedListUsers, SearchPagedListUsers } from "../Models/Users-paged-list.model";
import { changeUserStatusRepository, getPagedListUsersRepository, getUserByIdRespository, saveUserRepository } from "../Repository/User.repository";

export const getPagedListUsersService = async (search: SearchPagedListUsers): Promise<PagedListUsers> => {
    return await getPagedListUsersRepository(search);
}

export const getUserByIdService = async (userId: string): Promise<UsersResponse> => {
    let response = new UsersResponse();
    const user = await getUserByIdRespository(userId);
    response.Items = [user];
    return response;
}

export const changeUserStatusService = async (userId: string): Promise<ResponseMessages> => {
    try {
        return await changeUserStatusRepository(userId);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }
}

export const getOptionsFormUsersService = async (): Promise<OptionsFormUsers> => {
    let response = new OptionsFormUsers();

    try {
        const [roles, teachersActives] = await Promise.all([
            getRolesFromConfigRepository(),
            getTeachersActives()
        ])
        response.Roles = roles;
        response.TeachersActives = teachersActives;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const saveUserService = async (user: User): Promise<ResponseMessages> => {
    let response = new ResponseMessages();

    try {
        response = await saveUserRepository(user);
        return response;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;

}