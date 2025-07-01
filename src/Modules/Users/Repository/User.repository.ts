import { db } from "../../../Firebase/firebase";
import { getLimit } from "../../Config/Repository/Config.repository";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { User } from "../../Others/Models/Users";
import { PagedListUsers, SearchPagedListUsers } from "../Models/Users-paged-list.model";

export const getFullNameUserIdById = async (id: string): Promise<string> => {
    let response = "";
    try {
        const docRef = db.collection('Users').doc("Users");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }
        const users = docSnap.data()?.users ?? [];

        const user: User = users?.find((u: User) => u.id === id);
        if (user) {
            response = user.name
        }
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getUserByIdRespository = async (userId: string): Promise<User> => {
    let response = {} as User;
    try {
        const docRef = db.collection('Users').doc("Users");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el usuario");
        }
        const user = docSnap.data()?.users?.find((u: User) => u.id === userId);

        if (user) {
            response = user
        }
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPagedListUsersRepository = async (search: SearchPagedListUsers): Promise<PagedListUsers> => {
    const response = new PagedListUsers();
    try {
        const docRef = db.collection('Users').doc("Users");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }
        let usersData: User[] = docSnap.data()?.users ?? [];

        if (!Array.isArray(usersData)) {
            response.setError("No se encontraron precios válidos");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            usersData = usersData.filter((item: User) => item.status === search.Status);
        }

        if (search.Name) {
            usersData = usersData.filter((item: User) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase())
            );
        }
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedUsers = usersData.slice(startIndex, endIndex);

        response.Items = paginatedUsers.map((s: User) => {
            return {
                id: s.id,
                status: s.status || "",
                name: s.name,
                role: s.role
            }
        })
        response.TotalItems = usersData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const changeUserStatusRepository = async (userId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const docRef = db.collection('Users').doc("Users");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el usuario");
        }
        let users: User[] = docSnap.data()?.users ?? [];
        const currentUser = users.find((c: User) => c.id === userId);
        if (currentUser) {
            currentUser.status = currentUser.status === 'activo' ? 'inactivo' : 'activo';
            await docRef.update({ users });
            response.setSuccess('Usuario modificado con exito');
        }

        return response;
    } catch (error: any) {
        console.error("Error modificando usuario:", error);
        response.setError(error.message);
        return response;
    }

}

export const saveUserRepository = async (user: User): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const docRef = db.collection('Users').doc("Users");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el usuario");
        }
        let users: User[] = docSnap.data()?.users ?? [];
        const index = users.findIndex((c: User) => c.id === user.id);
        if (index !== -1) {
            users.splice(index, 1, user);
        } else {
            users.unshift(user);
        }
        await docRef.update({ users });
        response.setSuccess('Usuario modificado con exito');

        return response;
    } catch (error: any) {
        console.error("Error modificando usuario:", error);
        response.setError(error.message);
        return response;
    }

}