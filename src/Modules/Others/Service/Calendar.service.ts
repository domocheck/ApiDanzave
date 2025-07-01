import { ScheduleInfo } from "../Models/Schedule"
import { getScheduleInfoRepository } from "../Repository/Calendar.repository"

export const getScheduleInfoService = async (status: string, companyName: string): Promise<ScheduleInfo> => {
    const response = await getScheduleInfoRepository(status);
    return response;
}