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
    let response = "";
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students = docSnap.data()?.students ?? [];

        const student = students.find((s: IStudents) => s.id === id);
        if (student) {
            response = student.name + " " + student.lastName;
        }
        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getStudentByIdRepository = async (id: string): Promise<IStudents> => {
    try {
        const companyName = getCompanyName();

        if (!companyName) {
            throw new Error("Company name is not set");
        }

        // Referencia al documento "classes" dentro de la colección de la compañía
        const docRef = db.collection(companyName).doc("students");

        // Obtener el documento
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el alumno")
        }

        let student: IStudents = docSnap.data()?.students.filter((t: IStudents) => t.id === id)[0];

        return student;
    } catch (error) {
        console.error("Error obteniendo colores:", error);
        throw new Error("No se encontro el alumno")
    }
}

export const getStudentsActives = async (): Promise<StudentsActives[]> => {
    let studentsActives = [] as StudentsActives[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students = docSnap.data()?.students ?? [];

        studentsActives = students.filter((s: IStudents) => s.status === 'activo').map((student: IStudents) => {
            return {
                id: student.id,
                name: student.name,
                lastName: student.lastName,
                displayName: student.name + ' ' + student.lastName,
                createdDate: student.createDate!,
            };
        });

        return studentsActives.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getStudentsByStatus = async (status: string): Promise<IStudents[]> => {
    let studentsByStatus = [] as IStudents[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students = docSnap.data()?.students ?? [];

        studentsByStatus = students.filter((s: IStudents) => s.status === status);

        return studentsByStatus.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getStudentsRepository = async (): Promise<IStudents[]> => {
    let studentsResponse = [] as IStudents[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students = docSnap.data()?.students ?? [];

        studentsResponse = students;

        return studentsResponse.sort((a, b) => a.name.localeCompare(b.name))
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
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron asistencias");
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.data()?.assists ?? [];

        const currentAssists = assistsData.find((assist: IAssists) => assist.id === assistId);
        if (currentAssists) {
            currentAssists.recovers = currentAssists.recovers ?? [];
            if (!currentAssists.recovers.includes(studentId)) {
                currentAssists.recovers.push(studentId);
            }
        }

        // Actualizar el documento con la propiedad 'assists' actualizada
        await docRef.update({ assists: assistsData });

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
        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron esudiantes");
            return response;
        }

        let studentsData = docSnap.data()?.students;

        if (!Array.isArray(studentsData)) {
            response.setError("No se encontraron clases válidas");
            return response;
        }
        if (search.Status && search.Status !== 'all') {
            studentsData = studentsData.filter((item: IStudents) => item.status === search.Status);
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
                status: s.status,
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
}

export const changeStatusStudentRepository = async (changeStatus: ChangeStatusPerson): Promise<ResponseMessages> => {
    let response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students = docSnap.data()?.students ?? [];

        const student: IStudents = students.find((s: IStudents) => s.id === changeStatus.id);

        if (!student) {
            throw new Error("No se encontro el estudiante");
        }

        student.status = changeStatus.newStatus;

        if (changeStatus.newStatus === 'inactivo') {
            if (student.classes && student.classes.length > 0) {
                for (let classe of student.classes) {
                    await removeStudentToClassRepository(classe, changeStatus.id);
                }
            }
            student.classes = [];
            student.inactiveDate = format(new Date(), 'full');
        }

        student.idReason = changeStatus.reasonId;
        student.observationsInactive = changeStatus.observation;
        await docRef.update({ students });

        response.setSuccess("Estudiante actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
    }

    return response;
}

export const saveStudentRepository = async (student: IStudents): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("students");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontro el nombre");
        }

        const students: IStudents[] = docSnap.data()?.students ?? [];
        const index = students.findIndex((s: IStudents) => s.id === student.id);

        if (index !== -1) {
            students.splice(index, 1, student);
        } else {
            students.unshift(student);
        }

        await docRef.update({ students });
        response.setSuccess("Estudiante actualizado correctamente");

    } catch (error: any) {
        response.setError(error.message);
        return response;
    }
    return response
}