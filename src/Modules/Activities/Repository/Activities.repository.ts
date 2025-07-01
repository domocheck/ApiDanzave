import { db } from "../../../Firebase/firebase";
import { Assists, IAssists } from "../../Assists/Models/Assists.models";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { Activity, IActivity } from "../Models/Activities.models";
import { SearchActivities } from "../Models/search";


export const getActivitiesRepository = async (search: SearchActivities): Promise<Activity> => {
    const response = new Activity();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "activities" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            response.setError("No se encontraron actividades");
            return response;
        }

        // Acceder al campo 'activities' dentro del documento
        let activitiesData = docSnap.data()?.activities;

        // Verificar si 'activities' existe y es un arreglo
        if (!Array.isArray(activitiesData)) {
            response.setError("No se encontraron actividades válidas");
            return response;
        }

        if (search.Status) {
            activitiesData = activitiesData.filter((item: IActivity) => item.status === search.Status);
        }
        const page = search.Pagination.Page;
        const limit = search.Pagination.Limit;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedactivities = activitiesData.slice(startIndex, endIndex);

        response.Items = paginatedactivities as IActivity[];
        response.TotalItems = activitiesData.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo actividades:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getActivityByIdRepository = async (id: string): Promise<IActivity> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron actividades");
        }

        // Acceder al campo 'classes' dentro del documento
        let activitiesData: IActivity[] = docSnap.data()?.activities;
        if (!activitiesData || activitiesData.length === 0) return {} as IActivity;

        const activityFound = activitiesData.find((item: IActivity) => item.id === id);
        if (!activityFound) return {} as IActivity
        return activityFound
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }

}

export const getAssistsByActivityId = async (activityId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron asistencias");
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.data()?.assists ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = assistsData.filter((as: IAssists) => as.idClass === activityId);

        if (response.Items.length === 0) {
            response.setWarning("No se encontraron asistencias para esta actividad");
            return response;
        }

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};