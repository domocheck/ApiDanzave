import { db } from "../../../Firebase/firebase";
import { getActivitiesModel } from "../../../mongo/schemas/activities.schema";
import { getAssistsModel } from "../../../mongo/schemas/assists.schema";
import { Assists, IAssists } from "../../Assists/Models/Assists.models";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { Activity, IActivity } from "../Models/Activities.models";
import { SearchActivities } from "../Models/search";


export const getActivitiesRepository = async (search: SearchActivities): Promise<Activity> => {
    const response = new Activity();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ActivitiesModel = getActivitiesModel(companyName);

        // Traer todas las actividades
        let activitiesData: IActivity[] = await ActivitiesModel.find().lean();

        if (!activitiesData || activitiesData.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        // Filtrar por estado si aplica
        if (search.Status) {
            activitiesData = activitiesData.filter(a => a.status === search.Status);
        }

        // Paginación
        const page = search.Pagination.Page;
        const limit = search.Pagination.Limit;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedActivities = activitiesData.slice(startIndex, endIndex);

        response.Items = paginatedActivities;
        response.TotalItems = activitiesData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo actividades:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const getActivityByIdRepository = async (id: string): Promise<IActivity> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ActivitiesModel = getActivitiesModel(companyName);

        // Buscar la actividad directamente por id
        const activityFound = await ActivitiesModel.findOne({ "id": id }).lean();

        if (!activityFound) return {} as IActivity;

        return activityFound as IActivity;
    } catch (error: any) {
        console.error("Error obteniendo actividad:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const getAssistsByActivityId = async (activityId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const AssistsModel = getAssistsModel(companyName);

        // Traer asistencias filtrando por idClass = activityId
        const assistsData = await AssistsModel.find({ idClass: activityId }).lean();

        if (!assistsData || assistsData.length === 0) {
            response.setWarning("No se encontraron asistencias para esta actividad");
            return response;
        }

        response.Items = assistsData as IAssists[];

        return response;
    } catch (error: any) {
        console.error("Error obteniendo asistencias:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};
