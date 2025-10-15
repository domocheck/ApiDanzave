import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { ChangeStatusPerson } from "../../Students/Models/Students.models";
import { PagedListTeachers, SearchPagedListTeachers } from "../Models/Teachers-paged-list.models";
import { ITeachers, ColorsTeachers, TeachersActive, Substitutes } from "../Models/Teachers.models";
import { removeTeacherToClassRepository } from "../../Classes/Repository/Classes.repository";
import { IClasses } from "../../Classes/Models/classes.models";
import { getTeachersModel } from "../../../mongo/schemas/teachers.schema";
import { getClassesModel } from "../../../mongo/schemas/classes.schema";

export const getColorsTeachersRepository = async (): Promise<ColorsTeachers[]> => {
    let response: ColorsTeachers[] = [];

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Buscar todos los profesores activos
        const teachers: ITeachers[] = await TeachersModel.find({ status: "activo" }).lean();

        if (!teachers || teachers.length === 0) {
            return response;
        }

        response = teachers.map(t => ({
            Id: t.id,
            Color: t.color || null
        }));

        return response;
    } catch (error: any) {
        console.error("Error obteniendo colores:", error);
        return response;
    }
};


export const getFullNameTeacherById = async (id: string): Promise<string> => {
    let response = "";

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return "";

        const TeachersModel = getTeachersModel(companyName);

        // Buscar el profesor por id
        const teacher = await TeachersModel.findOne({ id }).lean();

        if (teacher && teacher.name && teacher.lastName) {
            response = `${teacher.name} ${teacher.lastName}`;
        }

        return response;
    } catch (error: any) {
        console.error("Error obteniendo docente:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getTeacherById = async (id: string): Promise<ITeachers> => {
    let teacher = {} as ITeachers;

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return teacher;

        const TeachersModel = getTeachersModel(companyName);

        // Buscar el docente por id
        const foundTeacher = await TeachersModel.findOne({ id }).lean();

        if (!foundTeacher) {
            return teacher;
        }

        teacher = foundTeacher;
        return teacher;
    } catch (error: any) {
        console.error("Error obteniendo docente:", error);
        throw new Error("No se encontraron docentes");
    }
};


export const getTeachersActives = async (): Promise<TeachersActive[]> => {
    let teachersActives: TeachersActive[] = [];

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Buscar todos los docentes activos
        const teachers = await TeachersModel.find({ status: "activo" }).lean();

        if (!teachers || teachers.length === 0) {
            throw new Error("No se encontraron docentes activos");
        }

        teachersActives = teachers.map((teacher: ITeachers) => ({
            id: teacher.id,
            name: teacher.name,
            lastName: teacher.lastName,
            displayName: `${teacher.name} ${teacher.lastName}`,
            createdDate: teacher.createDate!,
        }));

        return teachersActives.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error: any) {
        console.error("Error obteniendo docentes:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getTeachersRepository = async (): Promise<ITeachers[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Obtener todos los docentes
        const teachers = await TeachersModel.find().lean();

        if (!teachers || teachers.length === 0) {
            throw new Error("No se encontraron docentes");
        }

        return teachers as ITeachers[];
    } catch (error: any) {
        console.error("Error obteniendo docentes:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getSubstitutesRepository = async (teacherId: string): Promise<Substitutes> => {
    const response = new Substitutes();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Obtener todos los docentes excepto el indicado
        const substitutesData = await TeachersModel.find({ id: { $ne: teacherId } }).lean();

        if (!substitutesData || substitutesData.length === 0) {
            response.setWarning("No se encontraron docentes");
            return response;
        }

        response.Items = substitutesData.map(t => ({
            id: t.id,
            name: `${t.name} ${t.lastName}`
        }));

        return response;
    } catch (error: any) {
        console.error("Error obteniendo docentes:", error);
        throw new Error("No se encontraron docentes");
    }
};


export const getTeacherWhitMoreClassesRepository = async (): Promise<[string, number]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Obtener todos los docentes activos con al menos una clase
        const teachers = await TeachersModel.find({ status: "activo", classes: { $exists: true, $ne: [] } }).lean();

        if (!teachers || teachers.length === 0) {
            return ['', 0];
        }

        // Ordenar por cantidad de clases y tomar el primero
        const teacher = teachers.sort((a, b) => (b.classes?.length || 0) - (a.classes?.length || 0))[0];

        return [`${teacher.name} ${teacher.lastName}`, teacher.classes?.length || 0];
    } catch (error: any) {
        console.error("Error obteniendo docentes:", error);
        throw new Error("No se encontraron docentes");
    }
};


export const getPagedListTeachersRepository = async (search: SearchPagedListTeachers): Promise<PagedListTeachers> => {
    const response = new PagedListTeachers();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Construir filtro según status
        const filter: any = {};
        if (search.Status && search.Status !== 'all') {
            filter.status = search.Status;
        }

        // Obtener todos los docentes que cumplen el filtro
        let teachersData: ITeachers[] = await TeachersModel.find(filter).lean();

        if (!teachersData || teachersData.length === 0) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        // Filtrar por nombre si aplica
        if (search.Name) {
            const nameLower = search.Name.toLowerCase();
            teachersData = teachersData.filter(t =>
                t.name.toLowerCase().includes(nameLower) ||
                t.lastName.toLowerCase().includes(nameLower)
            );
        }

        // Paginación
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTeachers = teachersData.slice(startIndex, endIndex);

        response.Items = paginatedTeachers.map(t => ({
            id: t.id,
            status: t.status,
            fullName: `${t.name} ${t.lastName}`,
            numberOfClasses: t.classes?.length || 0
        }));

        response.TotalItems = teachersData.length;
        response.PageSize = limit;

        return response;
    } catch (error: any) {
        console.error("Error obteniendo docentes:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};


export const changeStatusTeacherRepository = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Obtener el docente
        const teacher = await TeachersModel.findOne({ id: changeStatus.id }).lean();

        if (!teacher) {
            response.setWarning("No se encontró el docente");
            return response;
        }

        // Actualizamos estado
        const updatedFields: Partial<ITeachers> = { status: changeStatus.newStatus };

        if (changeStatus.newStatus === 'inactivo') {
            if (teacher.classes && teacher.classes.length > 0) {
                for (const classe of teacher.classes) {
                    await removeTeacherToClassRepository(classe, changeStatus.id);
                }
            }
            updatedFields.classes = [];
            updatedFields.inactiveDate = format(new Date(), 'full');
        }

        updatedFields.idReason = changeStatus.reasonId;
        updatedFields.observationsInactive = changeStatus.observation;

        // Actualizar solo los campos modificados
        await TeachersModel.updateOne({ id: changeStatus.id }, { $set: updatedFields });

        response.setSuccess("Docente actualizado correctamente");
    } catch (error: any) {
        console.error("Error cambiando estado del docente:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const replaceTeacherRepository = async (
    teacherId: string,
    newTeacherId: string,
    classId: string
): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);
        const ClassesModel = getClassesModel(companyName);

        // Obtener docente antiguo y clase
        const teacherOld = await TeachersModel.findOne({ id: teacherId }).lean();
        const currentClass = await ClassesModel.findOne({ id: classId }).lean();

        if (!teacherOld || !currentClass) {
            throw new Error("No se encontró la maestra o la clase");
        }

        // Actualizar clase con nuevo docente
        await ClassesModel.updateOne({ id: classId }, { $set: { idTeacher: newTeacherId } });

        // Quitar clase del docente antiguo
        const updatedClasses = teacherOld.classes?.filter(c => c !== classId) || [];
        await TeachersModel.updateOne({ id: teacherId }, { $set: { classes: updatedClasses } });

        response.setSuccess("Docente reemplazado correctamente");
    } catch (error: any) {
        console.error("Error reemplazando docente:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const saveTeacherRepository = async (teacher: ITeachers): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const TeachersModel = getTeachersModel(companyName);

        // Guardar o actualizar el docente según si existe o no
        await TeachersModel.updateOne(
            { id: teacher.id },
            { $set: teacher },
            { upsert: true }
        );

        response.setSuccess("Docente guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando docente:", error);
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};
