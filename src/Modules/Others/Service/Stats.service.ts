import { getAssistsRepository } from "../../Assists/Repository/Assists.repository"
import { getClassesGropuedRepository } from "../../Classes/Repository/Classes.repository"
import { getTeachersRepository } from "../../Teachers/Repository/Teachers.repository"
import { PagedListAccountExpirations, SearchPagedListAccountExpirations } from "../Models/Stats/Accounts-expiration-paged-list.model"
import { AssistsByDateFilteringOptions, AssistsByDateResponse } from "../Models/Stats/Assists-by-date-paged-list.model"
import { AssistsControlFilteringOptions, AssistsControlResponse } from "../Models/Stats/Assists-control.model"
import { PagedListAvgAssists, SearchPagedListAvgAssists } from "../Models/Stats/Avg-Assists-paged-list.model"
import { PagedListContactsProofClass, SearchPagedListContactsProofClass } from "../Models/Stats/Contacts-proof-class-paged-list.model"
import { PagedListEnrolledStudents, SearchPagedListEnrolledStudents } from "../Models/Stats/Enrolled-students-paged-list.moodel"
import { HistoryAssistsResponse, HistoryClassesResponse } from "../Models/Stats/History-classes.model"
import { PagedListPaymentMethods, SearchPagedListPaymentMethods } from "../Models/Stats/Payment-method-paged-list.model"
import { PagedListPBS, SearchPagedListPBS } from "../Models/Stats/PBS-paged-list.model"
import { PagedListSalesStats, SearchPagedListSalesStats } from "../Models/Stats/Sales-stats-paged-list.model"
import { PagedListStudentsActives, SearchPagedListStudentsActives } from "../Models/Stats/Students-actives-paged-list.model"
import { PagedListStudentsInactives, SearchPagedListStudentsInactives } from "../Models/Stats/Students-inactives-paged-list.model"
import { getAssistsByDateRepository, getAssistsControlRepository, getHistoryClassesRepository, getPagedListAccountsExpirationRepository, getPagedListAvgAssistsRepository, getPagedListContactsProofClassRepository, getPagedListEnrolledStudentsRepository, getPagedListPaymentMethodRepository, getPagedListPBSRepository, getPagedListSaleStatsRepository, getPagedListStudentsActivesRepository, getPagedListStudentsInactivesRepository } from "../Repository/Stats.repository"

export const getPagedListPBSService = async (search: SearchPagedListPBS): Promise<PagedListPBS> => {
    return await getPagedListPBSRepository(search)
}

export const getPagedListPaymentMethodService = async (search: SearchPagedListPaymentMethods): Promise<PagedListPaymentMethods> => {
    return await getPagedListPaymentMethodRepository(search)
}

export const getPagedListStudentsInactivesService = async (search: SearchPagedListStudentsInactives): Promise<PagedListStudentsInactives> => {
    return await getPagedListStudentsInactivesRepository(search)
}

export const getPagedListStudentsActivesService = async (search: SearchPagedListStudentsActives): Promise<PagedListStudentsActives> => {
    return await getPagedListStudentsActivesRepository(search)
}

export const getPagedListContactsProofClassService = async (search: SearchPagedListContactsProofClass): Promise<PagedListContactsProofClass> => {
    return await getPagedListContactsProofClassRepository(search)
}

export const getPagedListEnrolledStudentsService = async (search: SearchPagedListEnrolledStudents): Promise<PagedListEnrolledStudents> => {
    return await getPagedListEnrolledStudentsRepository(search)
}

export const getAssistsByDateService = async (date: string, classeId: string): Promise<AssistsByDateResponse> => {
    return await getAssistsByDateRepository(date, classeId)
}

export const getAssistsByDateFilteringOptionsService = async (): Promise<AssistsByDateFilteringOptions> => {
    let response = new AssistsByDateFilteringOptions()
    try {
        response.Classes = await getClassesGropuedRepository();
    } catch (error: any) {
        response.setError(error.message)
        return response
    }

    return response
}

export const getAssistsControlService = async (day: string, year: string, teacherId: string): Promise<AssistsControlResponse> => {
    return await getAssistsControlRepository(day, year, teacherId)
}

export const getAssistsControlFilteringOptionsService = async (): Promise<AssistsControlFilteringOptions> => {
    let response = new AssistsControlFilteringOptions()
    try {
        const [teachers, assists] = await Promise.all([
            getTeachersRepository(),
            getAssistsRepository()
        ])

        response.Teachers = teachers;
        response.Assists = assists
    } catch (error: any) {
        response.setError(error.message)
        return response
    }

    return response
}

export const getPagedListAvgAssistsService = async (search: SearchPagedListAvgAssists): Promise<PagedListAvgAssists> => {
    return await getPagedListAvgAssistsRepository(search)
}

export const getHistoryClassesService = async (year: string, monthStart: number, monthEnd: number): Promise<HistoryClassesResponse> => {
    return await getHistoryClassesRepository(year, monthStart, monthEnd)
}
export const getHistoryAssistsService = async (yearSelected: string, dayName: string, teacherId: string, classeId: string): Promise<HistoryAssistsResponse> => {
    let response = new HistoryAssistsResponse();
    try {
        response.ClassAssists = (await getAssistsControlRepository(dayName, yearSelected, teacherId)).ClassAssist.filter(c => c.id == classeId)[0]
    } catch (error: any) {
        response.setError(error.message)
        return response
    }

    return response;
}

export const getPagedListSaleStatsService = async (search: SearchPagedListSalesStats): Promise<PagedListSalesStats> => {
    return await getPagedListSaleStatsRepository(search)
}

export const getPagedListAccountsExpirationService = async (search: SearchPagedListAccountExpirations): Promise<PagedListAccountExpirations> => {
    return await getPagedListAccountsExpirationRepository(search)
}
