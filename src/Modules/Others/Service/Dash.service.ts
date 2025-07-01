import { getAssistsTakenRepository } from "../../Assists/Repository/Assists.repository";
import { getClassesByStatusRepository } from "../../Classes/Repository/Classes.repository";
import { getPaymentsMethodsFromConfigRepository } from "../../Config/Repository/Config.repository";
import { getContactsActivitiesRepository } from "../../ContactsActivities/Repository/ContactsActivitiesRepository";
import { getMovementByTypeRepository } from "../../Drawers/Repository/Drawer.repository";
import { getStudentsByStatus } from "../../Students/Repository/StudentsRepository";
import { getTeacherWhitMoreClassesRepository } from "../../Teachers/Repository/Teachers.repository";
import { filterDate, generateAvgAssist, generateAvgStudents, getActivitiesComplete, getActivitiesToComplete, getActivitiesToCompleteToday, getStudentsByStatusHelper } from "../Helpers/Dash.helper";
import { months } from "../Helpers/Others";
import { DashActivitiesReport } from "../Models/Dash/Dash-activities-report";
import { DashPaymentMethodsDashReport } from "../Models/Dash/Dash-payment-methods-report";
import { DashPeopleTraffickingReport } from "../Models/Dash/Dash-people-trafficking-report";
import { DashRankigDaysReport } from "../Models/Dash/Dash-ranking-days-report";
import { DashStudentsReport } from "../Models/Dash/Dash-students-report";
import { NameAndValue } from "../Models/Others";

export const getStudentsDashReportService = async (month: number): Promise<DashStudentsReport> => {
    let response = new DashStudentsReport();
    const [studentsActives, studentsInactives] = await Promise.all([getStudentsByStatus('activo'), getStudentsByStatus('inactivo')])
    const currentMonth = months.filter((m) => m.value === month)[0];
    const currentYear = new Date().getFullYear().toString();
    const lastMonth = months.filter((m) => m.value === currentMonth.value - 1)[0] || months[11];

    response.studentsInactivesThisMonth = await getStudentsByStatusHelper(
        studentsInactives,
        currentMonth.name.toLowerCase(),
        'inactivo',
        currentYear
    );
    response.totalStudentsInactivesThisMonth = response.studentsInactivesThisMonth.length;
    response.totalStudentsInactivesLastMonth = (await getStudentsByStatusHelper(
        studentsInactives,
        lastMonth.name.toLowerCase(),
        'inactivo',
        currentYear
    )).length;

    response.studentsActivesThisMonth = await getStudentsByStatusHelper(
        studentsActives,
        currentMonth.name.toLowerCase(),
        'activo',
        currentYear
    );
    response.totalStudentsActivesThisMonth = response.studentsActivesThisMonth.length;
    response.totalStudentsActivesLastMonth = (await getStudentsByStatusHelper(
        studentsActives,
        lastMonth.name.toLowerCase(),
        'activo',
        currentYear
    )).length;

    response.totalStudentsThisMonth = studentsActives.length;
    response.totalStudentsLastMonth =
        response.totalStudentsThisMonth +
        response.totalStudentsInactivesThisMonth -
        response.totalStudentsActivesThisMonth;

    response.studentsRecoveredThisMonth = await getStudentsByStatusHelper(
        studentsActives,
        currentMonth.name.toLowerCase(),
        'recuperado',
        currentYear
    );
    response.totalStudentsRecoveredThisMonth = response.studentsRecoveredThisMonth.length;
    response.totalStudentsRecoveredLastMonth = (await getStudentsByStatusHelper(
        studentsActives,
        lastMonth.name.toLowerCase(),
        'recuperado',
        currentYear
    )).length;

    return response;
}

export const getPaymentMethodsDashReportService = async (): Promise<DashPaymentMethodsDashReport> => {
    let response = new DashPaymentMethodsDashReport();
    const [paymentsMethods, receiptMovements] = await Promise.all([getPaymentsMethodsFromConfigRepository(), getMovementByTypeRepository('receipt')]);
    let totalPayments: NameAndValue[] = [];
    const receiptMove = receiptMovements.filter((move) =>
        filterDate(move.date.toString()),
    );
    for (let i = 0; i < receiptMovements.length; i++) {
        for (let payment of paymentsMethods) {
            const paymentName = payment.name;

            if (totalPayments?.find((payment) => payment.name === paymentName)) {
                totalPayments.find((payment) => payment.name === paymentName)!.value +=
                    receiptMovements[i].paymentsMethods?.find(
                        (method) => method.idPayment === payment.id,
                    )!.value;
            } else {
                totalPayments.push({
                    name: paymentName,
                    value:
                        receiptMovements[i].paymentsMethods?.find((method) => method.idPayment === payment.id)
                            ?.value ?? 0,
                });
            }
        }
    }
    totalPayments.sort((a, b) => b.value - a.value);
    totalPayments.push({
        name: 'Total',
        value: receiptMovements.reduce(
            (acc, move) => acc + move.paymentsMethods?.reduce((acc, pay) => acc + pay.value, 0),
            0,
        ),
    });

    response.totalPayments = totalPayments;
    return response;
}

export const getRankigDaysDashReportService = async (): Promise<DashRankigDaysReport> => {
    let response = new DashRankigDaysReport();
    const receiptMovements = await getMovementByTypeRepository('receipt');
    const movements = receiptMovements.filter((move) => {
        const currentYear = new Date().getFullYear();
        const yearMove = move.date.toString().substring(move.date.toString().lastIndexOf(' ') + 1);
        return yearMove === currentYear.toString();
    });

    const totalPaidInYear = movements.reduce(
        (acc, move) => acc + move.paymentsMethods.reduce((acc, payment) => acc + payment.value, 0),
        0,
    );

    let quantity: NameAndValue[] = [];

    for (let movement of movements) {
        const dayMove = +movement.date
            .toString()
            .substring(
                movement.date.toString().indexOf(',') + 2,
                movement.date.toString().indexOf(' de'),
            );
        const existingDay = quantity.find((day) => day.name === dayMove.toString());
        const totalPaid = movement.paymentsMethods.reduce((acc, payment) => acc + payment.value, 0);
        if (!existingDay) {
            quantity.push({ name: dayMove.toString(), value: totalPaid });
        } else {
            existingDay.value += totalPaid;
        }
    }

    const topFiveDays = quantity
        .map((day) => ({ name: day.name, value: Math.round((day.value * 100) / totalPaidInYear) }))
        .slice(0, 5);

    topFiveDays.sort((a, b) => b.value - a.value); // Orden descendente por valor

    response.rankingDaysPayment = topFiveDays;


    return response;
}

export const getPeopleTraffickingDashReportService = async (): Promise<DashPeopleTraffickingReport> => {
    let response = new DashPeopleTraffickingReport();
    const [clasesActives, assistsTaken, teacherWhitMoreClasses] = await Promise.all([getClassesByStatusRepository('activo'), getAssistsTakenRepository(), getTeacherWhitMoreClassesRepository()]);
    const avgStudents = generateAvgStudents(clasesActives.Items);
    const avgAssists = generateAvgAssist(assistsTaken);

    response.peopleTrafficking = [
        {
            icon: 'fa-solid fa-landmark',
            value: clasesActives.Items.length,
            text: 'Total de clases activas',
        },
        {
            icon: 'fa-solid fa-graduation-cap',
            value: avgStudents,
            text: 'Promedio de alumnos por clase',
        },
        {
            icon: 'fa-solid fa-person-chalkboard',
            value: teacherWhitMoreClasses[0],
            text: `La maestra con mas clases dicta ${teacherWhitMoreClasses[1]} clases`,
        },
        {
            icon: 'fa-solid fa-clipboard-question',
            value: `${avgAssists}%`,
            text: 'Promedio de asistencias por clase',
        },
    ];

    return response;
}

export const getActivitiesDashReportService = async (): Promise<DashActivitiesReport> => {
    let response = new DashActivitiesReport();
    const date = new Date();
    const contactsActivities = await getContactsActivitiesRepository();
    const [toCompletesToday, toCompletes, completes] = await Promise.all([
        getActivitiesToCompleteToday(contactsActivities, date),
        getActivitiesToComplete(contactsActivities, date),
        getActivitiesComplete(contactsActivities, date)]);

    response.Completes = completes;
    response.ToComplete = toCompletes;
    response.ToCompleteToday = toCompletesToday;

    return response;
}