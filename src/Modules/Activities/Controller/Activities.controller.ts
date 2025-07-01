import { Request, Response } from "express";
import { mapStatus } from "../../Others/Helpers/Maps/MapStatus";
import { SearchActivities } from "../Models/search";
import { Activity } from "../Models/Activities.models";
import { getActivitiesService } from "../Service/Activities.service";

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    const { status, page, limit } = req.query;
    try {
        const statusString = mapStatus(Number(status));
        const search = new SearchActivities();
        search.Status = statusString;
        if (page) search.Pagination.Page = Number(page);
        if (limit) search.Pagination.Limit = Number(limit);
        const response = await getActivitiesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        const response = new Activity();
        response.setError(error.message);
        res.status(500).send(response);
    }
};