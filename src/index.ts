import express, { application, Request, Response } from "express";
import cors from "cors";
import { db } from "./Firebase/firebase";
import { Classes } from "./Modules/Classes/Models/classes.models";
import { getClasses } from "./Modules/Classes/Controller/Classes.controller";
import { RouteClasses } from "./Modules/Classes/Routes/Classes.routes";
import { RouteActivities } from "./Modules/Activities/Routes/Activities.routes";
import { RouteCalendar } from "./Modules/Others/Routes/Calendar.routes";
import { CompanyNameSingleton } from "./Modules/Others/Models/Companies";
import { ResponseMessages } from "./Modules/Others/Models/ResponseMessages";
import { RouteAssists } from "./Modules/Assists/Routes/Assists.Routes";
import { RouteTeachers } from "./Modules/Teachers/Routes/Teachers.routes";
import { RouteStudents } from "./Modules/Students/Routes/Students.routes";
import { RouteAccounts } from "./Modules/Accounts/Routes/Accounts.routes";
import { RouteDashboard } from "./Modules/Others/Routes/Dash.routes";
import { RouteContactsActivities } from "./Modules/ContactsActivities/Routes/ContactsActivities.routes";
import { RouteConfig } from "./Modules/Config/Routes/Config.routes";
import { RouteDrawer } from "./Modules/Drawers/Routes/Drawers.routes";
import { RouteContacts } from "./Modules/Contacts/Routes/Contacats.routes";
import { RouteBoutique } from "./Modules/Boutique/Routes/Boutique.routes";
import { RouteUsers } from "./Modules/Users/Routes/User.routes";
import { RouteStats } from "./Modules/Others/Routes/Stats.routes";
import connectDB, { getConnection } from "./mongo/connectDB";
import serverlessHttp from "serverless-http";

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    if (!getConnection()?.readyState) {
        console.log("Conectando a la base de datos...");
        await connectDB();
        console.log("Conexión a DB establecida");
    }
    next();
});

app.get("/api/company/setCompanyName", (req: any, res: any) => {
    const response = new ResponseMessages();
    const companyName = req.query.companyName as string;

    if (!companyName) {
        response.setError("No se proporcionó el nombre de la compañía");
        return res.status(400).json(response);
    }

    const companyInstance = CompanyNameSingleton.getInstance();
    companyInstance.setCompanyName(companyName);

    response.setSuccess("Nombre de la compañía establecido correctamente");
    return res.status(200).json(response);
});

app.use("/api/classes", RouteClasses)
app.use("/api/activities", RouteActivities)
app.use("/api/calendar", RouteCalendar)
app.use("/api/assists", RouteAssists)
app.use("/api/teachers", RouteTeachers)
app.use("/api/students", RouteStudents)
app.use("/api/accounts", RouteAccounts)
app.use("/api/dashboard", RouteDashboard)
app.use("/api/contactsActivities", RouteContactsActivities)
app.use("/api/config", RouteConfig)
app.use("/api/drawers", RouteDrawer)
app.use("/api/contacts", RouteContacts)
app.use("/api/boutique", RouteBoutique)
app.use("/api/users", RouteUsers)
app.use("/api/stats", RouteStats)


export default app;

