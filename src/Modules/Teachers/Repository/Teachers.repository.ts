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

export const getColorsTeachersRepository = async (): Promise<ColorsTeachers[]> => {
    let response = [] as ColorsTeachers[];
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("teachers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        let teachers: ITeachers = docSnap.data()?.teachers;

        if (!Array.isArray(teachers)) {
            return response;
        }
        const colorsTeachers = teachers.filter(t => t.status === 'activo').map(t => {
            return {
                Id: t.id,
                Color: t.color || null
            }
        });
        response = colorsTeachers;
        return response;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        return response;
    }
}

export const getFullNameTeacherById = async (id: string): Promise<string> => {
    let response = "";
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const teachers = docSnap.data()?.teachers ?? [];

        const teacher = teachers.find((s: ITeachers) => s.id === id);
        if (teacher) {
            response = teacher.name + " " + teacher.lastName;
        }
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTeacherById = async (id: string): Promise<ITeachers> => {
    let teacher = {} as ITeachers;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("teachers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron docentes")
        }

        teacher = docSnap.data()?.teachers.filter((t: ITeachers) => t.id === id)[0];

        return teacher;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontraron docentes")
    }
}

export const getTeachersActives = async (): Promise<TeachersActive[]> => {
    let teachersActives = [] as TeachersActive[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro");
        }

        const teachers = docSnap.data()?.teachers ?? [];

        teachersActives = teachers.filter((s: ITeachers) => s.status === 'activo').map((teacher: ITeachers) => {
            return {
                id: teacher.id,
                name: teacher.name,
                lastName: teacher.lastName,
                displayName: teacher.name + ' ' + teacher.lastName,
                createdDate: teacher.createDate!,
            };
        });

        return teachersActives.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
        console.error("Error obteniendo maetros:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getTeachersRepository = async (): Promise<ITeachers[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro");
        }

        return docSnap.data()?.teachers ?? [];
    } catch (error) {
        console.error("Error obteniendo maetros:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getSubstitutesRepository = async (teacherId: string): Promise<Substitutes> => {
    let response = new Substitutes();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("teachers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron docentes")
        }

        let substitutes: ITeachers[] = docSnap.data()?.teachers.filter((t: ITeachers) => t.id !== teacherId);

        if (!substitutes) {
            response.setWarning("No se encontraron docentes");
        }
        response.Items = substitutes.map(t => {
            return {
                name: `${t.name} ${t.lastName}`,
                id: t.id
            }
        })
        return response;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontraron docentes")
    }
}

export const getTeacherWhitMoreClassesRepository = async (): Promise<[string, number]> => {
    let teacher = {} as ITeachers;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("teachers");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron docentes")
        }

        const teachers: ITeachers[] = docSnap.data()?.teachers.filter((t: ITeachers) => t.status === 'activo' && t.classes.length > 0);

        if (!teachers) {
            return ['', 0];
        }
        teacher = teachers.sort((a, b) => b.classes.length - a.classes.length)[0];
        return [`${teacher?.name} ${teacher?.lastName}`, teacher?.classes?.length];
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontraron docentes")
    }
}

export const getPagedListTeachersRepository = async (search: SearchPagedListTeachers): Promise<PagedListTeachers> => {
    const response = new PagedListTeachers();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let teachersData = docSnap.data()?.teachers;

        if (!Array.isArray(teachersData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            teachersData = teachersData.filter((item: ITeachers) => item.status === search.Status);
        }

        if (search.Name) {
            teachersData = teachersData.filter((item: ITeachers) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }
        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedTeachers = teachersData.slice(startIndex, endIndex);

        response.Items = paginatedTeachers.map((s: ITeachers) => {
            return {
                id: s.id,
                status: s.status,
                fullName: `${s.name} ${s.lastName}`,
                numberOfClasses: s.classes?.length || 0
            }
        })
        response.TotalItems = teachersData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const changeStatusTeacherRepository = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const teachers = docSnap.data()?.teachers ?? [];

        const teacher: ITeachers = teachers.find((s: ITeachers) => s.id === changeStatus.id);

        if (!teacher) {
            throw new Error("No se encontro el estudiante");
        }

        teacher.status = changeStatus.newStatus;

        if (changeStatus.newStatus === 'inactivo') {
            if (teacher.classes && teacher.classes.length > 0) {
                for (let classe of teacher.classes) {
                    await removeTeacherToClassRepository(classe, changeStatus.id);
                }
            }
            teacher.classes = [];
            teacher.inactiveDate = format(new Date(), 'full');
        }

        teacher.idReason = changeStatus.reasonId;
        teacher.observationsInactive = changeStatus.observation;
        await docRef.update({ teachers });

        response.setSuccess("Maestra actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const replaceTeacherRepository = async (teacherId: string, newTeacherId: string, classId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const teacherRef = db.collection(companyName).doc("teachers");
        const classesRef = db.collection(companyName).doc("classes");
        const teacherSnap = await teacherRef.get();
        const classesSnap = await classesRef.get();

        if (!teacherSnap.exists || !classesSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const teachers = teacherSnap.data()?.teachers ?? [];
        const classes = classesSnap.data()?.classes ?? [];

        const teacherOld: ITeachers = teachers.find((s: ITeachers) => s.id === teacherId);
        const currentClass: IClasses = classes.find((c: IClasses) => c.id === classId);

        if (!teacherOld || !currentClass) {
            throw new Error("No se encontro la maestra o la clase");
        }

        if (currentClass) currentClass!.idTeacher = newTeacherId;
        if (teacherOld) teacherOld!.classes!.splice(teacherOld!.classes!.indexOf(classId), 1);
        await teacherRef.update({ teachers });
        await classesRef.update({ classes });

        response.setSuccess("Maestra actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const saveTeacherRepository = async (teacher: ITeachers): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("teachers");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const teachers: ITeachers[] = docSnap.data()?.teachers ?? [];
        const index = teachers.findIndex((s: ITeachers) => s.id === teacher.id);

        if (index !== -1) {
            teachers.splice(index, 1, teacher);
        } else {
            teachers.unshift(teacher);
        }

        await docRef.update({ teachers });
        response.setSuccess("Maestra actualizada correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}