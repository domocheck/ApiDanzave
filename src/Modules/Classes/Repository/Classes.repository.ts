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


export const getPagedListClassesRepository = async (search: SearchPagedListClasses): Promise<PagedListClasses> => {
    const response = new PagedListClasses();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        let docRef;
        if (search.Status && search.Status !== 'all') {
            docRef = db.collection(companyName).doc("classes").collection("classes").where("status", "==", search.Status);
        } else {
            docRef = db.collection(companyName).doc("classes").collection("classes")
        }

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        let classesData = docSnap.docs.map((doc) => doc.data() as IClasses);

        // Verificar si 'classes' existe y es un arreglo
        if (!Array.isArray(classesData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }

        if (search.Name) {
            classesData = classesData.filter((item: IClasses) => item.dance.toLowerCase().includes(search.Name.toLowerCase()));
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedClasses = classesData.slice(startIndex, endIndex);

        response.Items = paginatedClasses.map((c: IClasses) => {
            return {
                id: c.id,
                status: c.status,
                dance: c.dance,
                lounge: c.lounge,
                day: week[c.days[0]],
                schedule: c.schedule,
                students: c.students.length
            }
        });
        response.TotalItems = classesData.length;
        response.PageSize = limit;

        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getPagedListJuvetActivitiesRepository = async (search: SearchPagedListJuvetActivities): Promise<PagedListJuvetActivities> => {
    const response = new PagedListJuvetActivities();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        // Acceder al campo 'activities' dentro del documento
        let activitiesData = docSnap.data()?.activities;

        // Verificar si 'activities' existe y es un arreglo
        if (!Array.isArray(activitiesData)) {
            response.setError("No se encontraron actividades válidas");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            activitiesData = activitiesData.filter((item: IActivity) => item.status === search.Status);
        }

        if (search.Name) {
            activitiesData = activitiesData.filter((item: IActivity) => item.activity.toLowerCase().includes(search.Name.toLowerCase()));
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedactivities = activitiesData.slice(startIndex, endIndex);

        response.Items = paginatedactivities.map((c: IActivity) => {
            return {
                id: c.id,
                status: c.status,
                activity: c.activity,
                day: week[c.days[0]],
                schedule: c.schedule,
                students: c.students.length
            }
        });
        response.TotalItems = activitiesData.length;
        response.PageSize = limit;

        return response;
    } catch (error) {
        console.error("Error obteniendo actividades:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getClassesRepository = async (search: SearchPagedListClasses): Promise<Classes> => {
    const response = new Classes();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        let docRef;
        if (search.Status && search.Status !== 'all') {
            docRef = db.collection(companyName).doc("classes").collection("classes").where("status", "==", search.Status);
        } else {
            docRef = db.collection(companyName).doc("classes").collection("classes")
        }

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        let classesData = docSnap.docs.map((doc) => doc.data() as IClasses);

        // Verificar si 'classes' existe y es un arreglo
        if (!Array.isArray(classesData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }

        if (search.Name) {
            classesData = classesData.filter((item: IClasses) => item.dance.toLowerCase().includes(search.Name.toLowerCase()));
        }

        const page = search.Page;
        const limit = 100;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedClasses = classesData.slice(startIndex, endIndex);

        response.Items = paginatedClasses as IClasses[];
        response.TotalItems = classesData.length;

        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getJuvetActivitiesRepository = async (): Promise<IActivity[]> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron actividades");
        }

        // Acceder al campo 'activities' dentro del documento
        return docSnap.data()?.activities ?? [];

    } catch (error) {
        console.error("Error obteniendo actividades:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getClassesByStatusRepository = async (status: string): Promise<Classes> => {
    const response = new Classes();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").where("status", "==", status);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (docSnap.empty) {
            response.setWarning("No se encontraron clases");
            return response;
        }

        // Acceder al campo 'classes' dentro del documento
        let classesData = docSnap.docs.map((doc) => doc.data() as IClasses);
        // Verificar si 'classes' existe y es un arreglo
        if (!Array.isArray(classesData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }
        response.Items = classesData;
        response.TotalItems = classesData.length;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const changeClassStatusRepository = async (classId: string, newStatus: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const classDocRef = db
            .collection(companyName)
            .doc("classes")
            .collection("classes")
            .doc(classId);

        const docSnap = await classDocRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }
        const currentClass = docSnap.data() as IClasses;
        if (currentClass) {
            currentClass.status = newStatus;
            if (newStatus === 'inactivo') {
                currentClass.students = [];
                currentClass.idTeacher = ""
            }
        }

        await classDocRef.update({
            status: currentClass.status,
            students: currentClass.students,
            idTeacher: currentClass.idTeacher
        })
        response.setSuccess('Clase modificada con exito');

        return response;
    } catch (error: any) {
        console.error("Error modificando clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const changeJuvetActivityStatusRepository = async (activityId: string, newStatus: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron actividades");
        }

        // Acceder al campo 'activities' dentro del documento
        let activitiesData: IActivity[] = docSnap.data()?.activities;
        const currentClass = activitiesData.find((c: IActivity) => c.id === activityId);
        if (currentClass) {
            currentClass.status = newStatus;
            if (newStatus === 'inactivo') {
                currentClass.students = [];
                currentClass.idTeacher = ""
            }
        }

        await docRef.update({ activities: activitiesData })
        response.setSuccess('Actividad modificada con exito');

        return response;
    } catch (error: any) {
        console.error("Error modificando actividades:", error);
        response.setError(error.message);
        return response;
    }

}

export const getClassByIdRepository = async (id: string): Promise<IClasses> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(id);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        let classFound: IClasses = docSnap.data() as IClasses;

        if (!classFound) return {} as IClasses
        return classFound
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }

}


export const getJuvetActivityByIdRepository = async (id: string): Promise<IActivity> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("activities");

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron actividades");
        }

        // Acceder al campo 'classes' dentro del documento
        let activitiesData: IActivity[] = docSnap.data()?.activities;
        // Verificar si 'activities' existe y es un arreglo
        if (!Array.isArray(activitiesData)) {
            throw new Error("No se encontraron actividades válidas");
        }

        const activityFound = activitiesData.find((item: IActivity) => item.id === id);
        if (!activityFound) return {} as IActivity
        return activityFound
    } catch (error: any) {
        console.error("Error obteniendo actividades:", error);
        throw new Error("Error interno del servidor");
    }

}

export const removeTeacherToClassRepository = async (classId: string, teacherId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(classId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentClass = docSnap.data() as IClasses;
        if (currentClass) {
            currentClass.idTeacher = "";
        }

        await docRef.update({ idTeacher: currentClass.idTeacher })
        response.setSuccess('Maestra eliminada de la clase con exito');

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const removeStudentToClassRepository = async (classId: string, studentId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(classId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentclass: IClasses = docSnap.data() as IClasses;
        if (currentclass) {
            currentclass.students.splice(currentclass?.students.indexOf(studentId), 1);
        }

        await docRef.update({ students: currentclass.students })
        response.setSuccess('Estudiante eliminado de la clase con exito');

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const removeClassToStudentRepository = async (classId: string, studentId: string, type = 'students'): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc(type).collection(type).doc(studentId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentStudent = docSnap.data() as IStudents | IContacts;
        if (currentStudent.id) {
            currentStudent.classes!.splice(
                currentStudent.classes!.indexOf(classId),
                1,
            );
        }

        await docRef.update({ classes: currentStudent.classes });

        response.setSuccess('Estudiante eliminado de la clase con éxito');
        return response;

    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const removeClassToTeacherRepository = async (classId: string, teacherId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc('teachers').collection('teachers').doc(teacherId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentTeacher = docSnap.data() as ITeachers;
        if (currentTeacher.id) {
            currentTeacher.classes!.splice(
                currentTeacher.classes!.indexOf(classId),
                1,
            );
        }

        await docRef.update({ classes: currentTeacher.classes });

        response.setSuccess('Estudiante eliminado de la clase con éxito');
        return response;

    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const addStudentToClassRepository = async (classId: string, studentId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(classId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentClass = docSnap.data() as IClasses;
        if (currentClass) {
            currentClass.students.unshift(studentId);
        }

        await docRef.update({ students: currentClass.students })
        response.setSuccess('Estudiante eliminado de la clase con exito');

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const addTeacherToClassRepository = async (classId: string, teacherId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(classId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const currentClass = docSnap.data() as IClasses;
        if (currentClass) {
            currentClass.idTeacher = teacherId;
        }

        await docRef.update({ idTeacher: currentClass.idTeacher })
        response.setSuccess('Estudiante eliminado de la clase con exito');

        return response;
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        response.setError(error.message);
        return response;
    }

}

export const getClassesGropuedRepository = async (): Promise<ClassesActives[]> => {
    let response: ClassesActives[] = []

    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        const docRef = db.collection(companyName).doc("classes").collection("classes").where('status', '==', 'activo');
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }
        let classesData: IClasses[] = docSnap.docs.map((doc) => doc.data() as IClasses);

        classesData.forEach((classe) => {
            let daysOfWeek = classe.days.map((day) => {
                return week[day];
            });

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
        response
            .sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => {
                const dayIndexA = week.indexOf(a.days[0]);
                const dayIndexB = week.indexOf(b.days[0]);

                return dayIndexA - dayIndexB;
            }).sort((a, b) => a.lounge.localeCompare(b.lounge));


    } catch (error: any) {
        throw new Error(error.message);
    }

    return response;
}

export const saveClasseRepository = async (classe: IClasses): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const classRef = db
            .collection(companyName)
            .doc("classes")
            .collection("classes")
            .doc(classe.id); // Asegúrate de que movement.id esté definido y sea único

        await classRef.set(classe);

        response.setSuccess("clase guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando clase:", error);
        response.setError(error.message);
    }
    return response
}

export const saveJuvetActivityRepository = async (activity: IActivity): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("activities");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const activities: IActivity[] = docSnap.data()?.activities ?? [];
        const index = activities.findIndex((s: IActivity) => s.id === activity.id);

        if (index !== -1) {
            activities.splice(index, 1, activity);
        } else {
            activities.unshift(activity);
        }

        await docRef.update({ activities });
        response.setSuccess("La clase se ha guardado correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}

export const checkIsPersonOnClasseRepository = async (classeId: string, personId: string): Promise<boolean> => {
    let response = false;
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("classes").collection("classes").doc(classeId);

        // Obtener el documento
        const docSnap = await docRef.get();

        // Verificar si el documento existe
        if (!docSnap.exists) {
            throw new Error("No se encontraron clases");
        }

        // Acceder al campo 'classes' dentro del documento
        const classFound = docSnap.data() as IClasses;
        if (!classFound) return response
        return classFound.students.includes(personId);
    } catch (error: any) {
        console.error("Error obteniendo clases:", error);
        throw new Error("Error interno del servidor");
    }

} 