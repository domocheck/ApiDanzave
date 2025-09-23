import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { IAssists } from "../../Assists/Models/Assists.models";
import { removeStudentToClassRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { SearchPagedListStudents } from "../Models/Search";
import { ChangeStatusPerson, IStudents, PagedListStudents, StudentsActives } from "../Models/Students.models";

export const getFullNameStudentById = async (id: string): Promise<string> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");
        if (!id) return "";

        const docRef = db.collection(companyName).doc("students").collection("students").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return "";
        }

        const student = docSnap.data() as IStudents;

        if (!student || !student.name || !student.lastName) {
            throw new Error("Datos del estudiante incompletos");
        }

        return `${student.name} ${student.lastName}`;
    } catch (error) {
        console.error("Error obteniendo estudiante:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getStudentByIdRepository = async (id: string): Promise<IStudents> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        const docRef = db.collection(companyName).doc("students").collection("students").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return {} as IStudents;
        }

        const student = docSnap.data() as IStudents;

        if (!student || !student.name || !student.lastName) {
            throw new Error("Datos del estudiante incompletos");
        }

        return student;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontro el alumno")
    }
}

export const getStudentsActives = async (): Promise<StudentsActives[]> => {
    try {
        let studentsActives = [] as StudentsActives[];
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students").collection("students").where("status", "==", "activo").orderBy("name");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return studentsActives;
        }

        const students = docSnap.docs.map((doc) => doc.data() as IStudents);

        studentsActives = students.map((student: IStudents) => {
            return {
                id: student.id,
                name: student.name,
                lastName: student.lastName,
                displayName: student.name + ' ' + student.lastName,
                createdDate: student.createDate!,
            };
        });

        return studentsActives;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getStudentsByStatus = async (status: string): Promise<IStudents[]> => {
    try {
        let studentsByStatus = [] as IStudents[];
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const query = db
            .collection(companyName)
            .doc("students")
            .collection("students")
            .where("status", "==", status)
            .orderBy("name");

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return studentsByStatus;
        }

        studentsByStatus = querySnapshot.docs.map(doc => doc.data() as IStudents);
        return studentsByStatus;
    } catch (error) {
        console.error("Error obteniendo estudiantes por estado:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getStudentsRepository = async (): Promise<IStudents[]> => {
    try {
        let studentsResponse = [] as IStudents[];
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students").collection("students").orderBy("name");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return studentsResponse;
        }

        studentsResponse = docSnap.docs.map((doc) => doc.data() as IStudents);

        return studentsResponse;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const addRecoverStudentRepository = async (studentId: string, assistId: string): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists").collection("assists").doc(assistId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron asistencias");
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docRef as unknown as IAssists;

        const currentAssists = assistsData;
        let currentRecovers = currentAssists.recovers ?? [];
        if (currentAssists) {
            if (!currentRecovers.includes(studentId)) {
                currentRecovers.push(studentId);
            }
        }

        // Actualizar el documento con la propiedad 'assists' actualizada
        await docRef.update({ recovers: currentRecovers });

        response.setSuccess("Estudiante se agrego a la clase correctamente");
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
    }
    return response;
}

export const getPagedListStudentsRepository = async (search: SearchPagedListStudents): Promise<PagedListStudents> => {
    const response = new PagedListStudents();
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }
        let docRef;
        if (search.Status && search.Status !== 'all') {
            docRef = db.collection(companyName).doc("students").collection("students").where("status", "==", search.Status);
        } else {
            docRef = db.collection(companyName).doc("students").collection("students")
        }

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron actividades");
            return response;
        }

        let studentsData = docSnap.docs.map((doc) => doc.data() as IStudents);

        if (!Array.isArray(studentsData)) {
            response.setError("No se encontraron estudiantes válidos");
            return response;
        }

        if (search.Name) {
            studentsData = studentsData.filter((item: IStudents) =>
                item.name.toLowerCase().includes(search.Name.toLowerCase()) ||
                item.lastName.toLowerCase().includes(search.Name.toLowerCase())
            );
        }

        if (search.IsCareerStudent) {
            studentsData = studentsData.filter((s: IStudents) => s.isCareerStudent)
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedClasses = studentsData.slice(startIndex, endIndex);

        response.Items = paginatedClasses.map((s: IStudents) => {
            return {
                id: s.id,
                status: s.status!,
                fullName: `${s.name} ${s.lastName}`,
                numberOfClasses: s.classes?.length || 0
            }
        })
        response.TotalItems = studentsData.length;
        response.PageSize = limit;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
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

        // Referencia al doc individual del estudiante
        const studentDocRef = db
            .collection(companyName)
            .doc("students")
            .collection("students")
            .doc(changeStatus.id);

        const studentDoc = await studentDocRef.get();

        if (!studentDoc.exists) {
            throw new Error("No se encontró el estudiante");
        }

        const student = studentDoc.data() as IStudents;

        // Actualizamos estado
        student.status = changeStatus.newStatus;

        if (changeStatus.newStatus === "inactivo") {
            if (student.classes && student.classes.length > 0) {
                for (const classe of student.classes) {
                    await removeStudentToClassRepository(classe, changeStatus.id);
                }
            }
            student.classes = [];
            student.inactiveDate = format(new Date(), "full");
        }

        student.idReason = changeStatus.reasonId;
        student.observationsInactive = changeStatus.observation;

        // Actualizar solo el documento individual del estudiante
        await studentDocRef.update({
            status: student.status,
            classes: student.classes,
            inactiveDate: student.inactiveDate,
            idReason: student.idReason,
            observationsInactive: student.observationsInactive,
        });

        response.setSuccess("Estudiante actualizado correctamente");
    } catch (error: any) {
        response.setError(error.message || "Error interno del servidor");
    }

    return response;
};


export const saveStudentRepository = async (student: IStudents): Promise<ResponseMessages> => {
    const response = new ResponseMessages();

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const studentRef = db
            .collection(companyName)
            .doc("students")
            .collection("students")
            .doc(student.id); // Asegúrate de que movement.id esté definido y sea único

        await studentRef.set(student);

        response.setSuccess("estudiante guardado con éxito");
    } catch (error: any) {
        console.error("Error guardando estudiante:", error);
        response.setError(error.message);
    }

    return response;
}