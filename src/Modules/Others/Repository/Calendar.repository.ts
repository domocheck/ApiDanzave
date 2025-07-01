import { getActivitiesRepository } from "../../Activities/Repository/Activities.repository";
import { getClassesRepository } from "../../Classes/Repository/Classes.repository"
import { getHoursFromConfigRepository, getRangesFromConfigRepository } from "../../Config/Repository/Config.repository";
import { getColorsTeachersRepository } from "../../Teachers/Repository/Teachers.repository";
import { Pagination } from "../Models/Pagination"
import { ScheduleInfo } from "../Models/Schedule";

export const getScheduleInfoRepository = async (status: string): Promise<ScheduleInfo> => {
    const response = new ScheduleInfo();

    const [classes, activities, hours, colorsTeachers, ranges] = await Promise.all([
        getClassesRepository({ Status: status, Page: 1, Name: "" }),
        getActivitiesRepository({ Status: status, Pagination: new Pagination() }),
        getHoursFromConfigRepository(),
        getColorsTeachersRepository(),
        getRangesFromConfigRepository()
    ]);

    if (classes && !classes.hasErrors() && activities && !activities.hasErrors()) {
        response.Activities = activities.Items;
        response.Classes = classes.Items;
        response.Hours = hours;
        response.ColorsTeachers = colorsTeachers;
        response.Ranges = ranges;
        return response;
    }

    response.setError("No se encontraron actividades o clases");
    return response;
};