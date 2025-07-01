import { Request, Response } from "express";
import { ActivationStateEnum } from "../Enums/Activation.State.Enum";
import { ScheduleInfo } from "../Models/Schedule";
import { getScheduleInfoService } from "../Service/Calendar.service";

export const getScheduleInfo = async (req: Request, res: Response): Promise<void> => {
    const status = 'activo'
    const { companyName } = req.query;
    try {
        const response = await getScheduleInfoService(status, companyName as string);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new ScheduleInfo();
        response.setError(error.message);
        res.status(500).send(response);
    }
};