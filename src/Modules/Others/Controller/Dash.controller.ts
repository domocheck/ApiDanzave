import { Request, Response } from "express";
import { DashStudentsReport } from "../Models/Dash/Dash-students-report";
import { getActivitiesDashReportService, getPaymentMethodsDashReportService, getPeopleTraffickingDashReportService, getRankigDaysDashReportService, getStudentsDashReportService } from "../Service/Dash.service";
import { DashPaymentMethodsDashReport } from "../Models/Dash/Dash-payment-methods-report";
import { DashRankigDaysReport } from "../Models/Dash/Dash-ranking-days-report";
import { DashPeopleTraffickingReport } from "../Models/Dash/Dash-people-trafficking-report";
import { DashActivitiesReport } from "../Models/Dash/Dash-activities-report";

export const getStudentsDashReport = async (req: Request, res: Response): Promise<void> => {
    const { month } = req.query;
    try {
        const response = await getStudentsDashReportService(Number(month));
        res.status(200).send(response);
    } catch (error: any) {
        let response = new DashStudentsReport();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getPaymentMethodsDashReport = async (req: Request, res: Response): Promise<void> => {

    try {
        const response = await getPaymentMethodsDashReportService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new DashPaymentMethodsDashReport();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getRankigDaysDashReport = async (req: Request, res: Response): Promise<void> => {

    try {
        const response = await getRankigDaysDashReportService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new DashRankigDaysReport();
        response.setError(error.message);
        res.status(500).send(response);
    }

}

export const getPeopleTraffickingDashReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getPeopleTraffickingDashReportService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new DashPeopleTraffickingReport();
        response.setError(error.message);
        res.status(500).send(response);
    }
}

export const getActivitiesDashReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getActivitiesDashReportService();
        res.status(200).send(response);
    } catch (error: any) {
        let response = new DashActivitiesReport();
        response.setError(error.message);
        res.status(500).send(response);
    }
}