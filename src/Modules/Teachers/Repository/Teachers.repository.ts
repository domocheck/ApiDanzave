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
        const docRef = db.collection(companyName).doc("teachers").collection("teachers").where("status", "==", "activo");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let teachers: ITeachers[] = docSnap.docs.map(doc => doc.data() as ITeachers);

        if (!Array.isArray(teachers)) {
            return response;
        }
        const colorsTeachers = teachers.map(t => {
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
        if (!id) return "";

        const docRef = db.collection(companyName).doc("teachers").collection("teachers").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return "";
        }

        const teacher = docSnap.data() as ITeachers

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
        const docRef = db.collection(companyName).doc("teachers").collection("teachers").doc(id);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return teacher;
        }

        teacher = docSnap.data() as ITeachers

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

        const docRef = db.collection(companyName).doc("teachers").collection("teachers").where("status", "==", "activo");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontro");
        }

        const teachers = docSnap.docs.map(doc => doc.data() as ITeachers);

        teachersActives = teachers.map((teacher: ITeachers) => {
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

        const docRef = db.collection(companyName).doc("teachers").collection("teachers");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontro");
        }

        return docSnap.docs.map(doc => doc.data() as ITeachers);
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
        const docRef = db.collection(companyName).doc("teachers").collection("teachers").where("id", '!=', teacherId);

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        let substitutes: ITeachers[] = docSnap.docs.map(doc => doc.data() as ITeachers);

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
        const docRef = db.collection(companyName).doc("teachers").collection("teachers").where("status", "==", "activo");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron docentes")
        }

        const teachers: ITeachers[] = docSnap.docs.map(doc => doc.data() as ITeachers).filter((t: ITeachers) => t.classes.length > 0);

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
        let docRef;
        if (search.Status && search.Status !== 'all') {
            docRef = db.collection(companyName).doc("teachers").collection("teachers").where("status", "==", search.Status);
        } else {
            docRef = db.collection(companyName).doc("teachers").collection("teachers")
        }

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        let teachersData = docSnap.docs.map((doc) => doc.data() as ITeachers);

        if (!Array.isArray(teachersData)) {
            response.setError("No se encontraron clases válidas");
            return response;
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

        // Referencia al doc individual del estudiante
        const studentDocRef = db
            .collection(companyName)
            .doc("teachers")
            .collection("teachers")
            .doc(changeStatus.id);

        const studentDoc = await studentDocRef.get();

        if (!studentDoc.exists) {
            return response;
        }

        const teacher = studentDoc.data() as ITeachers;

        // Actualizamos estado
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
        // Actualizar solo el documento individual del estudiante
        await studentDocRef.update({
            status: teacher.status,
            classes: teacher.classes,
            inactiveDate: teacher.inactiveDate,
            idReason: teacher.idReason,
            observationsInactive: teacher.observationsInactive,
        });

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

        const teacherOldRef = db.collection(companyName).doc("teachers").collection("teachers").doc(teacherId);
        const classesRef = db.collection(companyName).doc("classes").collection("classes").doc(classId);
        const teacherOldSnap = await teacherOldRef.get();
        const classesSnap = await classesRef.get();

        if (!teacherOldSnap.exists || !classesSnap.exists) {
            throw new Error("No se encontro el nombre");
        }


        const teacherOld: ITeachers = teacherOldSnap.data() as ITeachers;
        const currentClass: IClasses = classesSnap.data() as IClasses;

        if (!teacherOld || !currentClass) {
            throw new Error("No se encontro la maestra o la clase");
        }

        if (currentClass) currentClass!.idTeacher = newTeacherId;
        if (teacherOld) teacherOld!.classes!.splice(teacherOld!.classes!.indexOf(classId), 1);
        await teacherOldRef.update({ classes: teacherOld!.classes });
        await classesRef.update({ idTeacher: currentClass!.idTeacher });

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

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const teacherRef = db
            .collection(companyName)
            .doc("teachers")
            .collection("teachers")
            .doc(teacher.id); // Asegúrate de que movement.id esté definido y sea único

        await teacherRef.set(teacher);

        response.setSuccess("estudiante guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando estudiante:", error);
        response.setError(error.message);
    }
    return response
}