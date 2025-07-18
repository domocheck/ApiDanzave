import { format } from "@formkit/tempo";
import { db } from "../../../Firebase/firebase";
import { getCompanyName } from "../../Others/Helpers/getCompanyName";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { AssistPerson, Assists, IAssists } from "../Models/Assists.models";
import { v4 as uuidv4 } from 'uuid';
import { getPersonWhitDebt, updateAccountTeacherService } from "../../Accounts/Service/Accounts.service";
import { IPagedListHistoryAssistsPerson, PagedListHistoryAssistsPersons, SearchPagedListHistoryAssistsPersons } from "../Models/Assists.-students-paged-list.model";
import { getFullNameStudentById } from "../../Students/Repository/StudentsRepository";
import { getClassByIdRepository } from "../../Classes/Repository/Classes.repository";
import { getLimit } from "../../Config/Repository/Config.repository";
import { getFullNameTeacherById } from "../../Teachers/Repository/Teachers.repository";
import { getFullNameContactById } from "../../Contacts/Repository/Contacts.repository";


export const getAssistsByClassId = async (classId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron asistencias");
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.data()?.assists ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = assistsData.filter((as: IAssists) => as.idClass === classId);

        if (response.Items.length === 0) {
            response.setWarning("No se encontraron asistencias para esta clase");
            return response;
        }

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getAssistsByPersonId = async (personId: string): Promise<Assists> => {
    const response = new Assists();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setError("No se encontraron asistencias");
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.data()?.assists ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = assistsData.filter((as: IAssists) => {
            return as.absent.includes(personId) ||
                as.disease.includes(personId) ||
                as.missing.includes(personId) ||
                as.presents.includes(personId) ||
                as.proofClass.includes(personId)
        });

        if (response.Items.length === 0) {
            response.setWarning("No se encontraron asistencias para esta clase");
            return response;
        }

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
};

export const getAssistById = async (assistId: string): Promise<IAssists> => {
    let assist = {} as IAssists;
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

        // Filtrar directamente mientras se asigna a response.Items
        assist = assistsData.find((as: IAssists) => as.id === assistId);

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsByDateRepository = async (date: Date): Promise<IAssists[]> => {
    let assist = [] as IAssists[];
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron asistencias");
        }
        const dateSearch = format(date, 'full');
        // Obtener solo la propiedad 'assists' del documento
        return docSnap.data()?.assists.filter((as: IAssists) => as.date === dateSearch) ?? [];

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsRepository = async (): Promise<IAssists[]> => {
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
        return docSnap.data()?.assists ?? [];

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const checkIsGenerateAssist = async (classId: string, date: string): Promise<boolean> => {
    let response = false;
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.data()?.assists ?? [];

        // Filtrar directamente mientras se asigna a response.Items
        const data = assistsData.filter((as: IAssists) => as.idClass === classId && as.date === date);

        response = data.length === 0;

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        return response;
    }
};

export const addAssistRepository = async (idClass: string): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const newAssist = {
            id: uuidv4(),
            idClass: idClass,
            date: format(new Date(), 'full'),
            presents: [],
            missing: [],
            absent: [],
            disease: [],
            proofClass: [],
            idTeacher: '',
        };

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();
        const assistsData = docSnap.data()?.assists ?? [];
        assistsData.unshift(newAssist);

        // Actualizar el documento con la propiedad 'assists'
        await docRef.update({
            assists: assistsData,
        });

        return response;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const chargePresencesRepository = async (newAssist: AssistPerson): Promise<ResponseMessages> => {
    const response = new ResponseMessages();
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const docRef = db.collection(companyName).doc("assists");
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            response.setError("No se encontraron asistencias");
            return response;
        }

        const assistsData = docSnap.data()?.assists ?? [];
        const currentAssists = assistsData.find((assist: IAssists) => assist.id === newAssist.idAssist);
        if (!currentAssists) {
            response.setError("No se encontró la asistencia correspondiente");
            return response;
        }

        if (newAssist.type === 'teacher') {
            if (newAssist.idPersonSustitute) {
                currentAssists.idTeacher = newAssist.idPerson;
                currentAssists.idSustitute = newAssist.idPersonSustitute;
            } else {
                currentAssists.idTeacher = newAssist.idPerson;
                currentAssists.idSustitute = '';
            }

            if (newAssist.status !== 'presents') {
                const personsWithDebt = await getPersonWhitDebt(newAssist.status);
                const substituteAccount = personsWithDebt?.find(p => p.idPerson === newAssist.idPersonSustitute)?.accounts[0];
                const teacherAccount = personsWithDebt?.find(p => p.idPerson === newAssist.idPerson)?.accounts[0];

                if (teacherAccount) {
                    await updateAccountTeacherService(teacherAccount.id, newAssist.idPerson, 'decrease');
                }
                if (substituteAccount) {
                    await updateAccountTeacherService(substituteAccount.id, newAssist.idPersonSustitute!, 'increase');
                }
            }
        }

        // Limpiar las asistencias previas del profesor en los arrays incorrectos
        Object.keys(currentAssists).forEach(key => {
            if (Array.isArray(currentAssists[key]) && key !== newAssist.status && key !== 'recovers') {
                currentAssists[key] = currentAssists[key].filter((id: string) => id !== newAssist.idPerson);
            }
        });

        // Agregar el id al array correcto si no existe
        if (!currentAssists[newAssist.status].includes(newAssist.idPerson)) {
            currentAssists[newAssist.status].push(newAssist.idPerson);
        }

        // **IMPORTANTE: Asegurar que la escritura se complete antes de retornar**
        await docRef.update({ assists: assistsData });

        response.setSuccess('Asistencia cargada con éxito');
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
    }

    return response;
};

export const getAssistsByStudentId = async (studentId: string): Promise<IAssists[]> => {
    let assist = [] as IAssists[];
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

        // Filtrar directamente mientras se asigna a response.Items
        assist = assistsData.filter((assist: IAssists) => {
            return (
                assist.absent.includes(studentId) ||
                assist.disease.includes(studentId) ||
                assist.presents.includes(studentId) ||
                assist.proofClass.includes(studentId) ||
                assist.missing.includes(studentId)
            );
        });

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }

}

export const getAssistsByTeacherId = async (teacherId: string): Promise<IAssists[]> => {
    let assist = [] as IAssists[];
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

        // Filtrar directamente mientras se asigna a response.Items
        assist = assistsData.filter((assist: IAssists) => {
            return (
                assist.absent.includes(teacherId) ||
                assist.disease.includes(teacherId) ||
                assist.presents.includes(teacherId) ||
                assist.proofClass.includes(teacherId) ||
                assist.missing.includes(teacherId) ||
                assist.idTeacher === teacherId
            );
        });

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }

}

export const getAssistsTakenRepository = async (): Promise<IAssists[]> => {
    let assist: IAssists[] = [];
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

        // Filtrar directamente mientras se asigna a response.Items
        assist = assistsData.filter((a: IAssists) => a.absent.length > 0 ||
            a.disease.length > 0 ||
            a.missing.length > 0 ||
            a.presents.length > 0 ||
            a.proofClass.length > 0,);

        return assist
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
}

export const getPagedListStudentAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameStudent = await getFullNameStudentById(search.PersonId);
        const assists = await getAssistsByStudentId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        const assistsByStudent = assists.map(async (assist: IAssists) => {
            const classe = await getClassByIdRepository(assist.idClass);
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameStudent;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });

        let assist = await Promise.all(assistsByStudent);

        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameStudent;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListTeacherAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameTeacher = await getFullNameTeacherById(search.PersonId);
        const assists = await getAssistsByTeacherId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        const assistsByStudent = assists.map(async (assist: IAssists) => {
            const classe = await getClassByIdRepository(assist.idClass);
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameTeacher;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });

        let assist = await Promise.all(assistsByStudent);

        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameTeacher;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}

export const getPagedListContactAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameContact = await getFullNameContactById(search.PersonId);
        const assists = await getAssistsByTeacherId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        const assistsByStudent = assists.map(async (assist: IAssists) => {
            const classe = await getClassByIdRepository(assist.idClass);
            const danceClasse = classe.dance;
            const assistByStudent = {} as IPagedListHistoryAssistsPerson;
            assistByStudent.date = assist.date;
            assistByStudent.namePerson = nameContact;
            assistByStudent.danceClasse = danceClasse;
            assistByStudent.classId = assist.idClass;
            if (assist.absent.includes(search.PersonId)) {
                assistByStudent.status = 'ausente sin aviso';
            }
            if (assist.disease.includes(search.PersonId)) {
                assistByStudent.status = 'por enfermedad';
            }
            if (assist.presents.includes(search.PersonId)) {
                assistByStudent.status = 'presentes';
            }
            if (assist.proofClass.includes(search.PersonId)) {
                assistByStudent.status = 'clase de prueba';
            }
            if (assist.missing.includes(search.PersonId)) {
                assistByStudent.status = 'ausente con aviso';
            }
            return assistByStudent;
        });

        let assist = await Promise.all(assistsByStudent);

        if (search.Assist && search.Assist !== 'all') {
            assist = assist.filter((assist: IPagedListHistoryAssistsPerson) => assist.status.toLowerCase() === search.Assist.toLowerCase());
        }

        const page = search.Page;
        const limit = await getLimit();
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedAssist = assist.slice(startIndex, endIndex);

        response.Items = paginatedAssist;
        response.TotalItems = assist.length;
        response.PageSize = limit;
        response.NamePerson = nameContact;
        return response;
    } catch (error) {
        console.error("Error obteniendo clases:", error);
        response.setError("Error interno del servidor");
        return response;
    }
}
