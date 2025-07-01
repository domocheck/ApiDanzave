import { Request, Response } from "express"
import { PagedListPBS, SearchPagedListPBS } from "../Models/Stats/PBS-paged-list.model"
import { getAssistsByDateFilteringOptionsService, getAssistsByDateService, getAssistsControlFilteringOptionsService, getAssistsControlService, getHistoryAssistsService, getHistoryClassesService, getPagedListAccountsExpirationService, getPagedListAvgAssistsService, getPagedListContactsProofClassService, getPagedListEnrolledStudentsService, getPagedListPaymentMethodService, getPagedListPBSService, getPagedListSaleStatsService, getPagedListStudentsActivesService, getPagedListStudentsInactivesService } from "../Service/Stats.service"
import { PagedListStudentsInactives, SearchPagedListStudentsInactives } from "../Models/Stats/Students-inactives-paged-list.model"
import { PagedListStudentsActives, SearchPagedListStudentsActives } from "../Models/Stats/Students-actives-paged-list.model"
import { PagedListContactsProofClass, SearchPagedListContactsProofClass } from "../Models/Stats/Contacts-proof-class-paged-list.model"
import { PagedListEnrolledStudents, SearchPagedListEnrolledStudents } from "../Models/Stats/Enrolled-students-paged-list.moodel"
import { AssistsByDateFilteringOptions, AssistsByDateResponse } from './../Models/Stats/Assists-by-date-paged-list.model';
import { format } from "@formkit/tempo"
import { AssistsControlFilteringOptions, AssistsControlResponse } from "../Models/Stats/Assists-control.model"
import { PagedListAvgAssists, SearchPagedListAvgAssists } from "../Models/Stats/Avg-Assists-paged-list.model"
import { HistoryClassesResponse } from "../Models/Stats/History-classes.model"
import { PagedListPaymentMethods, SearchPagedListPaymentMethods } from "../Models/Stats/Payment-method-paged-list.model"
import { PagedListSalesStats, SearchPagedListSalesStats } from "../Models/Stats/Sales-stats-paged-list.model"
import { PagedListAccountExpirations, SearchPagedListAccountExpirations } from "../Models/Stats/Accounts-expiration-paged-list.model"

//Payment by student
export const getPagedListPBS = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, student, paymentMethod, page } = req.query
    try {
        const search = new SearchPagedListPBS()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Student = student ? student as string : undefined
        search.PaymentMethod = paymentMethod ? paymentMethod as string : undefined
        search.Page = Number(page)
        const response = await getPagedListPBSService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListPBS()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Payments methods
export const getPagedListPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, payment, page } = req.query
    try {
        const search = new SearchPagedListPaymentMethods()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Payment = payment ? payment as string : undefined
        search.Page = Number(page)
        const response = await getPagedListPaymentMethodService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListPaymentMethods()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Students inactives
export const getPagedListStudentsInactives = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, reason, page, name } = req.query
    try {
        const search = new SearchPagedListStudentsInactives()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Reason = reason ? reason as string : undefined
        search.Page = Number(page)
        search.Name = name as string
        const response = await getPagedListStudentsInactivesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListStudentsInactives()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Students actives
export const getPagedListStudentsActives = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, status, page, name } = req.query
    try {
        const search = new SearchPagedListStudentsActives()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Status = status as string
        search.Page = Number(page)
        search.Name = name as string
        const response = await getPagedListStudentsActivesService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListStudentsActives()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Contacts proofClass
export const getPagedListContactsProofClass = async (req: Request, res: Response): Promise<void> => {
    const { year, month, page, name } = req.query
    try {
        const search = new SearchPagedListContactsProofClass()
        search.Year = year as string;
        search.Month = Number(month);
        search.Page = Number(page)
        search.Name = name as string
        const response = await getPagedListContactsProofClassService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListContactsProofClass()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Enrolled students
export const getPagedListEnrolledStudents = async (req: Request, res: Response): Promise<void> => {
    const { year, month, page, name, status, payment } = req.query
    try {
        const search = new SearchPagedListEnrolledStudents()
        search.Year = year as string;
        search.Month = Number(month);
        search.Page = Number(page)
        search.Name = name as string
        search.Status = status as string
        search.Payment = payment as string
        const response = await getPagedListEnrolledStudentsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListEnrolledStudents()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getAssistsByDate = async (req: Request, res: Response): Promise<void> => {
    const { date, classeId } = req.query
    try {
        const [year, month, day] = (date as string).split("-").map(Number);
        const dateSearch = format(new Date(year, month - 1, day, 12), 'full');
        const response = await getAssistsByDateService(dateSearch, classeId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new AssistsByDateResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getAssistsByDateFilteringOptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAssistsByDateFilteringOptionsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new AssistsByDateFilteringOptions()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getAssistsControl = async (req: Request, res: Response): Promise<void> => {
    const { day, year, teacherId } = req.query
    try {
        const response = await getAssistsControlService(day as string, year as string, teacherId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new AssistsControlResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getAssistsControlFilteringOptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getAssistsControlFilteringOptionsService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new AssistsControlFilteringOptions()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//AVG Assists
export const getPagedListAvgAssists = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, students, teachers, page } = req.query
    try {
        const search = new SearchPagedListAvgAssists()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Student = students && students !== 'undefined' ? (students as string).split(',') : []
        search.Teacher = teachers && teachers !== 'undefined' ? (teachers as string).split(',') : []
        search.Page = Number(page)
        const response = await getPagedListAvgAssistsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListAvgAssists()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//History Classes
export const getHistoryClasses = async (req: Request, res: Response): Promise<void> => {
    const { year, monthStart, monthEnd } = req.query
    try {
        const response = await getHistoryClassesService(year as string, Number(monthStart), Number(monthEnd));
        res.status(200).send(response);
    } catch (error: any) {
        let response = new HistoryClassesResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

export const getHistoryAssists = async (req: Request, res: Response): Promise<void> => {
    const { yearSelected, dayName, teacherId, classeId } = req.query
    try {
        const response = await getHistoryAssistsService(yearSelected as string, dayName as string, teacherId as string, classeId as string);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new HistoryClassesResponse()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Sales
export const getPagedListSaleStats = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate, student, product, page } = req.query
    try {
        const search = new SearchPagedListSalesStats()
        search.StartDate = startDate ? new Date(startDate as string) : undefined
        search.EndDate = endDate ? new Date(endDate as string) : undefined
        search.Student = student && student !== 'undefined' ? (student as string) : undefined
        search.Product = product && product !== 'undefined' ? (product as string) : undefined
        search.Page = Number(page)
        const response = await getPagedListSaleStatsService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListSalesStats()
        response.setError(error.message)
        res.status(500).send(response)
    }
}

//Sales
export const getPagedListAccountsExpiration = async (req: Request, res: Response): Promise<void> => {
    const { date, isSearchByDate, page } = req.query
    try {
        const search = new SearchPagedListAccountExpirations()
        search.Date = date ? new Date(date as string) : undefined
        search.IsSearchByDate = isSearchByDate && isSearchByDate !== 'false' ? true : false
        search.Page = Number(page)
        const response = await getPagedListAccountsExpirationService(search);
        res.status(200).send(response);
    } catch (error: any) {
        let response = new PagedListAccountExpirations()
        response.setError(error.message)
        res.status(500).send(response)
    }
}
