import { IStudents, ISudentsDash } from "../../../Students/Models/Students.models";
import { ResponseMessages } from "../ResponseMessages";

export class DashStudentsReport extends ResponseMessages {
    totalStudentsThisMonth: number = 0;
    totalStudentsLastMonth: number = 0;
    studentsInactivesThisMonth: ISudentsDash[] = []
    totalStudentsInactivesThisMonth: number = 0;
    totalStudentsInactivesLastMonth: number = 0;
    studentsActivesThisMonth: ISudentsDash[] = [];
    totalStudentsActivesThisMonth: number = 0;
    totalStudentsActivesLastMonth: number = 0;
    studentsRecoveredThisMonth: ISudentsDash[] = [];
    totalStudentsRecoveredThisMonth: number = 0;
    totalStudentsRecoveredLastMonth: number = 0;
}