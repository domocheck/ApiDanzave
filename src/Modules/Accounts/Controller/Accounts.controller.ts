import { Request, Response } from "express";
import { editAccountService, generateAccountService, generateStudentsAccountsService, generateTeachersAccountsService, getAccountsStudentsActivesService, getIndAccountService, getPagedListAccountsService, getPagedListUnpaidAccountsService, getSettleIFormInfoService, getStatusAccountsStudentService, getStatusAccountsTeacherService, settleAccountService } from "../Service/Accounts.service";
import { Account, EditAccount, GenerateAccount, SettleAccount, SettleAccountResponse, SettleFormInfo, StatusAccountInd, StatusAccountStudent } from "../Models/Accounts.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { PagedListAccounts, PagedListUnpaidAccounts, SearchPagedListUnpaidAccounts } from "../Models/Accounts-paged-list.models";
import { getStudentsAccounts, saveAccounts } from "../Repository/Accounts.repository";

export const getAccountsStudentsActives = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAccountsStudentsActivesService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new Account();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getStatusAccountsStudent = async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.query;
    try {
        if (!studentId) throw new Error("el id es requerido");
        const response = await getStatusAccountsStudentService(studentId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new StatusAccountStudent();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getStatusAccountsTeacher = async (req: Request, res: Response): Promise<void> => {
    const { teacherId } = req.query;
    try {
        if (!teacherId) throw new Error("el id es requerido");
        const response = await getStatusAccountsTeacherService(teacherId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new StatusAccountStudent();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getIndAccount = async (req: Request, res: Response): Promise<void> => {
    const { type, accountId } = req.query;
    try {
        const response = await getIndAccountService(type as string, accountId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new StatusAccountInd();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const editAccount = async (req: Request, res: Response): Promise<void> => {
    const editAccount: EditAccount = req.body;
    try {
        const response = await editAccountService(editAccount);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getSettleFormInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getSettleIFormInfoService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new SettleFormInfo();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const settleAccount = async (req: Request, res: Response): Promise<void> => {
    const { settleAccounts } = req.body;
    try {
        const response = await settleAccountService(settleAccounts)
        res.status(200).send(response);
    } catch (error: any) {
        let resposne = new SettleAccountResponse();
        resposne.setError(error.message);
        res.status(500).send(resposne);
    }

}

export const getPagedListAccounts = async (req: Request, res: Response): Promise<void> => {
    const { name, status, page, type } = req.query;
    try {
        const response = await getPagedListAccountsService({
            Name: name as string,
            Status: status as string,
            Page: Number(page),
            Type: type as string
        });
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListAccounts();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const generateStudentsAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await generateStudentsAccountsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const generateTeachersAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await generateTeachersAccountsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const generateAccount = async (req: Request, res: Response): Promise<void> => {
    const { type, personId, amount, eftAmount, description } = req.query;
    try {
        const generateAccount: GenerateAccount = {
            personId: personId as string,
            type: type as string,
            amount: Number(amount),
            eftAmount: Number(eftAmount),
            description: description as string
        }
        const response = await generateAccountService(generateAccount);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPagedListUnpaidAccounts = async (req: Request, res: Response): Promise<void> => {
    const { month, year, name, page, status } = req.query
    try {
        const search: SearchPagedListUnpaidAccounts = {
            Name: name as string,
            Status: status as string,
            Page: Number(page),
            Month: Number(month),
            Year: Number(year)
        }
        const response = await getPagedListUnpaidAccountsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListUnpaidAccounts();
        response.setError(error.message);
        res.status(500).send(response);
    }
}


// export const deleteDuplicatedAccounts = async (req: Request, res: Response): Promise<void> => {
//     const accounts = (await getStudentsAccounts()).Items;

//     const descripcionesVistas = new Set();
//     const resultado = [];

//     for (const obj of accounts) {
//         const cumpleCondiciones = obj.idPerson === '9c36d149-3758-46cf-8656-95a426c78b51' && obj.month === 3;

//         if (cumpleCondiciones) {
//             if (!descripcionesVistas.has(obj.description?.toLowerCase())) {
//                 descripcionesVistas.add(obj.description?.toLowerCase());
//                 resultado.push(obj); // Primer duplicado con condiciones se guarda
//             }
//             // Si ya se vio, lo salteamos (no lo agregamos)
//         } else {
//             resultado.push(obj); // No cumple condiciones => se conserva siempre
//         }
//     }

//     await saveAccounts(resultado)

// }