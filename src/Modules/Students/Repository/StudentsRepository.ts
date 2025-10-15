import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { IAssists } from "../../Assists/Models/Assists.models";
import { removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { SearchPagedListStudents } from "../Models/Search";
import { ChangeStatusPerson, IStudents, PagedListStudents, StudentsActives } from "../Models/Students.models";
import { getStudentModel } from "../../../mongo/schemas/students.schema";
import { getAssistsModel } from "../../../mongo/schemas/assists.schema";
import { getClassesModel } from "../../../mongo/schemas/classes.schema";
import { IClasses } from "../../Classes/Models/classes.models";
import { IActivity } from "../../Activities/Models/Activities.models";
import { Config, IConfig } from "../../Config/Models/Config.models";
import { getConfigModel } from "../../../mongo/schemas/config.schema";
import { v4 as uuidv4 } from 'uuid';
import { IContacts, IContactsActivities } from "../../Contacts/Models/Contact.models";
import { getContactsModel } from "../../../mongo/schemas/contacts.schema";
import { IDrawer, IMovement } from "../../Drawers/Models/Drawer.models";
import { getDrawersModel } from "../../../mongo/schemas/drawers.schema";
import { getDrawerMovementsModel } from "../../../mongo/schemas/drawersMovements.schema";
import { IAccount } from "../../Accounts/Models/Accounts.models";
import { getStudentsAccountsModel } from "../../../mongo/schemas/studentsAccounts.schema";
import { getTeachersAccountsModel } from "../../../mongo/schemas/teachersAccounts.schema";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { getTeachersModel } from "../../../mongo/schemas/teachers.schema";
import { getContactsActivitiesModel } from "../../../mongo/schemas/contactsActivities.schema";
import { Product, ProductsResponse } from "../../Boutique/Models/Products.models";
import { getProductsModel } from "../../../mongo/schemas/products.schema";
import { getActivitiesModel } from './../../../mongo/schemas/activities.schema';
import { User } from "../../Others/Models/Users";


export const getFullNameStudentById = async (id: string): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return "";

        const StudentsModel = getStudentModel(companyName);

        // Buscar el estudiante por su id
        const student = await StudentsModel.findOne({ id }).lean();

        if (!student || !student.name || !student.lastName) {
            throw new Error("Datos del estudiante incompletos");
        }

        return `${student.name} ${student.lastName}`;
    } catch (error: any) {
        console.error("Error obteniendo estudiante:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};

export const getStudentByIdRepository = async (id: string): Promise<IStudents> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Buscar el estudiante por su id
        const student = await StudentsModel.findOne({ id });

        if (!student || !student.name || !student.lastName) {
            return {} as IStudents
        }

        return student as IStudents;
    } catch (error: any) {
        console.error("Error obteniendo estudiante:", error);
        throw new Error(error.message || "No se encontró el alumno");
    }
};


export const getStudentsActives = async (): Promise<StudentsActives[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Buscar estudiantes activos y ordenarlos por nombre
        const students = await StudentsModel.find({ status: "activo" }).sort({ name: 1 }).lean();

        const studentsActives: StudentsActives[] = students.map((student: IStudents) => ({
            id: student.id,
            name: student.name,
            lastName: student.lastName,
            displayName: `${student.name} ${student.lastName}`,
            createdDate: student.createDate!,
        }));

        return studentsActives;
    } catch (error: any) {
        console.error("Error obteniendo estudiantes activos:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const getStudentsByStatus = async (status: string): Promise<IStudents[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Buscar estudiantes por estado y ordenarlos por nombre
        const studentsByStatus = await StudentsModel.find({ status })
            .sort({ name: 1 })
            .lean();

        return studentsByStatus as IStudents[];
    } catch (error: any) {
        console.error("Error obteniendo estudiantes por estado:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};



export const getStudentsRepository = async (): Promise<IStudents[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Obtener todos los estudiantes y ordenarlos por nombre
        const studentsResponse = await StudentsModel.find({})
            .sort({ name: 1 })
            .lean();

        return studentsResponse as IStudents[];
    } catch (error: any) {
        console.error("Error obteniendo estudiantes:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const addRecoverStudentRepository = async (studentId: string, assistId: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Obtener el modelo de asistencias para la empresa
        const AssistsModel = getAssistsModel(companyName);

        // Buscar la asistencia por ID
        const assist = await AssistsModel.findOne({ id: assistId }).lean();
        if (!assist) throw new Error("No se encontraron asistencias");

        // Actualizar recovers asegurando que no haya duplicados
        const recovers = assist.recovers ?? [];
        if (!recovers.includes(studentId)) {
            recovers.push(studentId);
            await AssistsModel.updateOne({ id: assistId }, { $set: { recovers } });
        }

        response.setSuccess("Estudiante se agregó a la clase correctamente");
    } catch (error: any) {
        console.error("Error agregando estudiante a recovers:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const getPagedListStudentsRepository = async (search: SearchPagedListStudents): Promise<PagedListStudents> => {
    const response = new PagedListStudents();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Construir el filtro según los parámetros de búsqueda
        const filter: any = {};
        if (search.Status && search.Status !== 'all') filter.status = search.Status;
        if (search.IsCareerStudent) filter.isCareerStudent = true;
        if (search.Name) {
            // Buscar por nombre o apellido (insensible a mayúsculas)
            filter.$or = [
                { name: { $regex: search.Name, $options: 'i' } },
                { lastName: { $regex: search.Name, $options: 'i' } },
            ];
        }

        // Obtener la cantidad total de estudiantes que cumplen el filtro
        const totalItems = await StudentsModel.countDocuments(filter);

        // Paginación
        const limit = await getLimit();
        const page = search.Page;
        const skip = (page - 1) * limit;

        // Obtener estudiantes paginados
        const studentsData = await StudentsModel.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (!studentsData || studentsData.length === 0) {
            response.setWarning("No se encontraron estudiantes");
            return response;
        }

        // Mapear resultados
        response.Items = studentsData.map((s: IStudents) => ({
            id: s.id,
            status: s.status!,
            fullName: `${s.name} ${s.lastName}`,
            numberOfClasses: s.classes?.length || 0,
        }));

        response.TotalItems = totalItems;
        response.PageSize = limit;
        return response;
    } catch (error: any) {
        console.error("Error obteniendo estudiantes:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const changeStatusStudentRepository = async (
    changeStatus: ChangeStatusPerson
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentsModel = getStudentModel(companyName);

        // Buscar estudiante por id
        const student = await StudentsModel.findOne({ id: changeStatus.id }).lean();
        if (!student) throw new Error("No se encontró el estudiante");

        // Si el nuevo estado es "inactivo", remover estudiante de sus clases
        if (changeStatus.newStatus === "inactivo" && student && student.classes && student.classes?.length > 0) {
            for (const classId of student.classes) {
                await removeStudentToClassRepository(classId, changeStatus.id);
            }
        }

        // Actualizar campos del estudiante
        const updateData: Partial<IStudents> = {
            status: changeStatus.newStatus,
            idReason: changeStatus.reasonId,
            observationsInactive: changeStatus.observation,
        };

        if (changeStatus.newStatus === "inactivo") {
            updateData.classes = [];
            updateData.inactiveDate = new Date();
        }

        // Actualizar en MongoDB
        await StudentsModel.updateOne({ id: changeStatus.id }, { $set: updateData });

        response.setSuccess("Estudiante actualizado correctamente");
    } catch (error: any) {
        console.error("Error actualizando estudiante:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};



export const saveStudentRepository = async (student: IStudents): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const StudentModel = getStudentModel(companyName);

        // Insertar o actualizar el estudiante según su id
        await StudentModel.updateOne(
            { id: student.id }, // filtro por id
            { $set: student },  // datos a actualizar
            { upsert: true }    // si no existe, lo crea
        );

        response.setSuccess("Estudiante guardado correctamente");
    } catch (error: any) {
        console.error("Error guardando estudiante:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};



// export const saveStudentsRepository = async (): Promise<ResponseMessages> => {
//     const response = new ResponseMessages();

//     try {
//         const companyId: number = 2
//         const companyName = companyId === 1 ? 'Danzave' : companyId === 2 ? 'Juvet' : 'Colegio'

//         const data = await getCollections<IContactsActivities>("zContactsActivities", "activities", companyName);
//         if (!data || data.length === 0) {
//             console.log('no hay registros para copiar');
//             return response;
//         }
//         if (!companyName) throw new Error("Company name is not set");

//         const dataModel = getContactsActivitiesModel(companyName);

//         const operations = data.map(x => ({
//             updateOne: {
//                 filter: { id: x.id },
//                 update: { $set: x },
//                 upsert: true
//             }
//         }));
//         console.log(`Comenzando el copiado de ${data.length} registros`)
//         await dataModel.bulkWrite(operations);
//         console.group((`Se actualizaron/insertaron ${data.length} registros`))
//         response.setSuccess(`Se actualizaron/insertaron ${data.length} registros`);

//     } catch (error: any) {
//         console.error("Error guardando registros:", error);
//         response.setError(error.message);
//     }

//     return response;
// }

// export const getCollections = async <T>(collectionName: string, subCollectionName: string, companyName: string): Promise<T[]> => {
//     try {

//         if (!companyName) {
//             throw new Error("Company name is not set");
//         }

//         const docRef = db.collection(companyName).doc(collectionName).collection(subCollectionName);
//         const docSnap = await docRef.get();

//         if (docSnap.empty) {
//             return [];
//         }

//         return docSnap.docs.map(doc => doc.data() as T);

//     } catch (error) {
//         console.error("Error obteniendo la coleccion:", error);
//         throw new Error("No se encontraron la coleccion");
//     }
// };

// export const saveConfigMongo = async (): Promise<ResponseMessages> => {
//     const response = new ResponseMessages();

//     try {
//         const companyName = "Danzave";
//         const data = await getConfigAsync(companyName);

//         if (!data || !data.Items) {
//             console.log("No se encontró config en Firestore");
//         }

//         const dataModel = getConfigModel(companyName);

//         console.log(`Comenzando el copiado de la configuración`);

//         await dataModel.replaceOne(
//             { _id: "config" },      // siempre el mismo ID
//             { _id: "config", ...data.Items }, // reemplaza todo
//             { upsert: true }        // crea si no existe
//         );

//         console.log("Config reemplazada en Mongo correctamente");

//         response.setSuccess("Registro actualizado correctamente");

//     } catch (error: any) {
//         console.error("Error guardando registro:", error);
//         response.setError(error.message);
//     }

//     return response;
// };


// export const getConfigAsync = async (companyName: string): Promise<Config> => {
//     let response = new Config();
//     try {
//         const docRef = db.collection(companyName).doc("config");

//         const docSnap = await docRef.get();
//         if (!docSnap.exists) {
//             return response;
//         }

//         let config = docSnap.data();
//         console.log(config)

//         if (!config) {
//             return response;
//         }
//         response.Items = config;

//         return response;
//     } catch (error: any) {
//         response.setError(error.message);
//         return response;
//     }
// }