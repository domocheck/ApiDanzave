import { Classes, ClassesActives, IClasses } from "../Models/classes.models";
import { SearchClasses } from "../Models/search";
import { db } from "../../../Firebase/firebase";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { IStudents } from "../../Students/Models/Students.models";
import { week } from "../../Others/Helpers/Others";
import { IPagedListClasse, PagedListClasses, SearchPagedListClasses } from "../Models/classes-paged-list-models";
import { getLimit } from "../../Config/Repository/Config.repository";
import { scheduler } from "timers/promises";
import { ITeachers } from "../../Teachers/Models/Teachers.models";
import { IActivity } from "../../Activities/Models/Activities.models";
import { PagedListJuvetActivities, SearchPagedListJuvetActivities } from "../Models/juvet-activites-paged-list.model";
import { IContacts } from "../../Contacts/Models/Contact.models";
import { getClassesModel } from "../../../mongo/schemas/classes.schema";
import { getActivitiesModel } from "../../../mongo/schemas/activities.schema";
import { getStudentModel } from "../../../mongo/schemas/students.schema";
import { getContactsModel } from "../../../mongo/schemas/contacts.schema";
import { getTeachersModel } from "../../../mongo/schemas/teachers.schema";
import { Model } from "mongoose";


export const getPagedListClassesRepository = async (
    search: SearchPagedListClasses
): Promise<PagedListClasses> => {
    const response = new PagedListClasses();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Construimos el filtro
        const filter: any = {};
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }
        if (search.Name) {
            // Busca por nombre de dance ignorando mayúsculas/minúsculas
            filter.dance = { $regex: search.Name, $options: 'i' };
        }

        const page = search.Page;
        const limit = await getLimit();
        const skip = (page - 1) * limit;

        // Obtenemos los documentos paginados
        const [classesData, totalItems] = await Promise.all([
            classesModel.find(filter).skip(skip).limit(limit),
            classesModel.countDocuments(filter)
        ]);

        if (!classesData || classesData.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        response.Items = classesData.map((c: IClasses) => ({
            id: c.id,
            status: c.status,
            dance: c.dance,
            lounge: c.lounge,
            day: c.days && c.days.length > 0 ? week[c.days[0]] : '',
            schedule: c.schedule,
            students: c.students?.length || 0
        }));

        response.TotalItems = totalItems;
        response.PageSize = limit;

        return response;

    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const getPagedListJuvetActivitiesRepository = async (
    search: SearchPagedListJuvetActivities
): Promise<PagedListJuvetActivities> => {
    const response = new PagedListJuvetActivities();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const activitiesModel = getActivitiesModel(companyName);

        // Construimos el filtro
        const filter: any = {};
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }
        if (search.Name) {
            filter.activity = { $regex: search.Name, $options: 'i' };
        }

        const page = search.Page;
        const limit = await getLimit();
        const skip = (page - 1) * limit;

        // Obtenemos documentos paginados
        const [activitiesData, totalItems] = await Promise.all([
            activitiesModel.find(filter).skip(skip).limit(limit),
            activitiesModel.countDocuments(filter)
        ]);

        if (!activitiesData || activitiesData.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        response.Items = activitiesData.map((c: IActivity) => ({
            id: c.id,
            status: c.status,
            activity: c.activity,
            day: c.days && c.days.length > 0 ? week[c.days[0]] : '',
            schedule: c.schedule,
            students: c.students?.length || 0
        }));

        response.TotalItems = totalItems;
        response.PageSize = limit;

        return response;

    } catch (error: any) {
        console.error("Error obteniendo actividades:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const getClassesRepository = async (search: SearchPagedListClasses): Promise<Classes> => {
    const response = new Classes();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Construimos el filtro
        const filter: any = {};
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }
        if (search.Name) {
            filter.dance = { $regex: search.Name, $options: 'i' }; // Insensible a mayúsculas/minúsculas
        }

        const page = search.Page;
        const limit = 100;
        const skip = (page - 1) * limit;

        // Obtenemos documentos paginados y el total
        const [classesData, totalItems] = await Promise.all([
            classesModel.find(filter).skip(skip).limit(limit),
            classesModel.countDocuments(filter)
        ]);

        if (!classesData || classesData.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        response.Items = classesData as IClasses[];
        response.TotalItems = totalItems;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const getJuvetActivitiesRepository = async (): Promise<IActivity[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const activitiesModel = getActivitiesModel(companyName);

        // Suponemos que el documento que contiene el arreglo tiene un id fijo, por ejemplo "activitiesDoc"
        const activitiesDoc = await activitiesModel.find()

        if (!activitiesDoc) {
            throw new Error("No se encontraron actividades");
        }

        // Retornamos el arreglo 'activities'
        return activitiesDoc ?? [];
    } catch (error: any) {
        console.error("Error obteniendo actividades:", error);
        throw new Error(error.message || "Error interno del servidor");
    }
};


export const getClassesByStatusRepository = async (status: string): Promise<Classes> => {
    const response = new Classes();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Buscar directamente los documentos que tengan el status
        const classesData = await classesModel.find({ status }).lean();

        if (!classesData || classesData.length === 0) {
            response.setWarning("No se encontraron clases");
            return response;
        }

        response.Items = classesData as IClasses[];
        response.TotalItems = classesData.length;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const changeClassStatusRepository = async (
    classId: string,
    newStatus: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Construir los campos a actualizar
        const updateFields: any = { status: newStatus };

        if (newStatus === "inactivo") {
            updateFields.students = [];
            updateFields.idTeacher = "";
        }

        // Buscar y actualizar directamente
        const updatedClass = await classesModel.findOneAndUpdate(
            { id: classId },
            { $set: updateFields },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedClass) {
            throw new Error("No se encontraron clases");
        }

        response.setSuccess("Clase modificada con éxito");
        return response;
    } catch (error: any) {
        console.error("Error modificando clases:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const changeJuvetActivityStatusRepository = async (
    activityId: string,
    newStatus: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const activitiesModel = getActivitiesModel(companyName);

        // Definir los campos que se deben actualizar
        const updateFields: any = { status: newStatus };

        if (newStatus === "inactivo") {
            updateFields.students = [];
            updateFields.idTeacher = "";
        }

        // Buscar y actualizar directamente
        const updatedActivity = await activitiesModel.findOneAndUpdate(
            { id: activityId },
            { $set: updateFields },
            { new: true } // Retorna el documento actualizado
        );

        if (!updatedActivity) {
            throw new Error("No se encontraron actividades");
        }

        response.setSuccess("Actividad modificada con éxito");
        return response;
    } catch (error: any) {
        console.error("Error modificando actividades:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const getClassByIdRepository = async (id: string): Promise<IClasses> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName); // Modelo Mongoose para la colección "classes"

        // Buscar la clase por su id
        const classFound = await classesModel.findOne({ id });

        if (!classFound) {
            throw new Error("No se encontraron clases");
        }

        return classFound.toObject() as IClasses; // Convertir a objeto plano si es necesario
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }
};



export const getJuvetActivityByIdRepository = async (id: string): Promise<IActivity> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const activitiesModel = getActivitiesModel(companyName); // Modelo Mongoose para "activities"

        // Buscar el documento que contenga el array 'activities' y tenga el id buscado
        const doc = await activitiesModel.findOne({ id });

        if (!doc) {
            throw new Error("No se encontraron actividades");
        }

        return doc;
    } catch (error: any) {
        console.error("Error obteniendo actividades:", error);
        throw new Error("Error interno del servidor");
    }
};


export const removeTeacherToClassRepository = async (
    classId: string,
    teacherId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Buscar y actualizar directamente
        const updatedClass = await classesModel.findOneAndUpdate(
            { id: classId },
            { $set: { idTeacher: "" } },
            { new: true } // Retorna la clase actualizada
        );

        if (!updatedClass) {
            response.setError("No se encontraron clases");
            return response;
        }

        response.setSuccess("Maestra eliminada de la clase con éxito");
        return response;
    } catch (error: any) {
        console.error("Error eliminando teacher de la clase:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const removeStudentToClassRepository = async (
    classId: string,
    studentId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Buscar la clase y eliminar al estudiante del array
        const updatedClass = await classesModel.findOneAndUpdate(
            { id: classId },
            { $pull: { students: studentId } }, // Elimina el studentId del array
            { new: true } // Devuelve la clase actualizada
        );

        if (!updatedClass) {
            response.setError("No se encontraron clases");
            return response;
        }

        response.setSuccess("Estudiante eliminado de la clase con éxito");
        return response;
    } catch (error: any) {
        console.error("Error eliminando estudiante de la clase:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const removeClassToStudentRepository = async (
    classId: string,
    studentId: string,
    type: "students" | "contacts" = "students"
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        let model: Model<any>;

        if (type === "students") {
            model = getStudentModel(companyName);
        } else {
            model = getContactsModel(companyName);
        }

        // Buscar y actualizar en un solo paso usando $pull
        const updatedStudent = await model.findOneAndUpdate(
            { id: studentId },
            { $pull: { classes: classId } }, // elimina classId del array
            { new: true }
        );

        if (!updatedStudent) {
            response.setError("No se encontró el estudiante");
            return response;
        }

        response.setSuccess("Estudiante eliminado de la clase con éxito");
        return response;
    } catch (error: any) {
        console.error("Error eliminando clase del estudiante:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const removeClassToTeacherRepository = async (
    classId: string,
    teacherId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const teachersModel = getTeachersModel(companyName);

        // Buscar y actualizar en un solo paso usando $pull
        const updatedTeacher = await teachersModel.findOneAndUpdate(
            { id: teacherId },
            { $pull: { classes: classId } }, // elimina classId del array
            { new: true }
        );

        if (!updatedTeacher) {
            response.setError("No se encontró el docente");
            return response;
        }

        response.setSuccess("Clase eliminada del docente con éxito");
        return response;
    } catch (error: any) {
        console.error("Error eliminando clase del docente:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const addStudentToClassRepository = async (
    classId: string,
    studentId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Agregar el estudiante al inicio del array si no existe ya
        const updatedClass = await classesModel.findOneAndUpdate(
            { id: classId },
            { $addToSet: { students: studentId } }, // agrega solo si no existe
            { new: true }
        );

        if (!updatedClass) {
            response.setError("No se encontró la clase");
            return response;
        }

        // Para agregarlo al inicio del array (opcional)
        if (updatedClass.students[0] !== studentId) {
            await classesModel.findOneAndUpdate(
                { id: classId },
                { $pull: { students: studentId } }
            );
            await classesModel.findOneAndUpdate(
                { id: classId },
                { $push: { students: { $each: [studentId], $position: 0 } } }
            );
        }

        response.setSuccess("Estudiante agregado a la clase con éxito");
        return response;

    } catch (error: any) {
        console.error("Error agregando estudiante a la clase:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};



export const addTeacherToClassRepository = async (
    classId: string,
    teacherId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Buscar la clase y actualizar el teacher en un solo paso
        const updatedClass = await classesModel.findOneAndUpdate(
            { id: classId },
            { $set: { idTeacher: teacherId } },
            { new: true } // devuelve el documento actualizado
        );

        if (!updatedClass) {
            throw new Error("No se encontraron clases");
        }

        response.setSuccess("Maestro asignado a la clase con éxito");
        return response;
    } catch (error: any) {
        console.error("Error modificando clases:", error);
        response.setError(error.message || "Error interno del servidor");
        return response;
    }
};


export const getClassesGropuedRepository = async (): Promise<ClassesActives[]> => {
    const response: ClassesActives[] = [];

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);
        // Buscar clases activas
        const classesData: IClasses[] = await classesModel.find({ status: "activo" });

        if (!classesData || classesData.length === 0) return response;

        classesData.forEach((classe) => {
            const daysOfWeek = classe.days.map((day) => week[day]);

            response.push({
                id: classe.id,
                name: `${classe.dance} - ${classe.lounge}`,
                schedule: classe.schedule,
                duration: classe.duration,
                days: daysOfWeek,
                students: classe.students,
                lounge: classe.lounge,
                numberDay: classe.days[0],
            });
        });

        // Ordenar por nombre, día y lounge
        response
            .sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => week.indexOf(a.days[0]) - week.indexOf(b.days[0]))
            .sort((a, b) => a.lounge.localeCompare(b.lounge));

    } catch (error: any) {
        console.error("Error obteniendo clases agrupadas:", error);
        throw new Error("Error interno del servidor");
    }

    return response;
}

export const saveClasseRepository = async (classe: IClasses): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const classesModel = getClassesModel(companyName);

        // Usando findOneAndUpdate con upsert para crear o actualizar
        await classesModel.findOneAndUpdate(
            { id: classe.id },  // buscar por id
            classe,             // datos a guardar
            { upsert: true, new: true } // crea si no existe
        );

        response.setSuccess("Clase guardada con éxito");
    } catch (error: any) {
        console.error("Error guardando clase:", error);
        response.setError(error.message);
    }

    return response;
}

export const saveJuvetActivityRepository = async (activity: IActivity): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const JuvetActivityModel = getActivitiesModel(companyName);

        // findOneAndUpdate busca por id y actualiza, si no existe lo crea (upsert: true)
        await JuvetActivityModel.findOneAndUpdate(
            { id: activity.id },     // filtro
            activity,      // datos a actualizar
            { upsert: true, new: true } // crea si no existe y devuelve el documento actualizado
        );

        response.setSuccess("La actividad se ha guardado correctamente");
    } catch (error: any) {
        console.error("Error guardando actividad:", error);
        response.setError(error.message);
    }

    return response;
}

export const checkIsPersonOnClasseRepository = async (classeId: string, personId: string): Promise<boolean> => {
    let response = false;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const ClassesModel = getClassesModel(companyName);

        // Buscar la clase por id
        const classFound = await ClassesModel.findOne({ id: classeId }).exec();
        if (!classFound) return false;

        // Verificar si el estudiante está en la clase
        return classFound.students.includes(personId);
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }

} 