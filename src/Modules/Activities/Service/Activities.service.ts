import { Activity } from "../Models/Activities.models"
import { SearchActivities } from "../Models/search"
import { getActivitiesRepository } from "../Repository/Activities.repository"

export const getActivitiesService = async (search: SearchActivities): Promise<Activity> => {
    return await getActivitiesRepository(search)
}
