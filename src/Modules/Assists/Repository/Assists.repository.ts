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
        const docRef = db.collection(companyName).doc("assists").collection("assists").where("idClass", "==", classId);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron asistencias");
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.docs.map((doc) => doc.data() as IAssists);

        // Filtrar directamente mientras se asigna a response.Items
        response.Items = assistsData;

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
        const docRef = db.collection(companyName).doc("assists").collection("assists").where("idPerson", "==", personId);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            response.setWarning("No se encontraron asistencias");
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.docs.map((doc) => doc.data() as IAssists);

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
        const docRef = db.collection(companyName).doc("assists").collection("assists").doc(assistId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            throw new Error("No se encontraron asistencias");
        }

        // Obtener solo la propiedad 'assists' del documento

        assist = docSnap.data() as IAssists;

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

        const dateSearch = format(date, 'full');
        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists").collection("assists").where("date", "==", dateSearch);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron asistencias");
        }
        // Obtener solo la propiedad 'assists' del documento
        return docSnap.docs.map((doc) => doc.data() as IAssists);

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
        const docRef = db.collection(companyName).doc("assists").collection("assists");
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron asistencias");
        }

        // Obtener solo la propiedad 'assists' del documento
        return docSnap.docs.map((doc) => doc.data() as IAssists);

    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};

export const getAssistsByTeacherIdAndClassRepository = async (teacherId: string): Promise<IAssists[]> => {
    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        // Referencia al documento "assists"
        const docRef = db.collection(companyName).doc("assists").collection("assists")
            .where("idTeacher", "==", teacherId)
            .where("idClass", "!=", null);
        const docSnap = await docRef.get();

        if (docSnap.empty) {
            throw new Error("No se encontraron asistencias");
        }

        // Obtener solo la propiedad 'assists' del documento
        return docSnap.docs.map((doc) => doc.data() as IAssists);

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
        const docRef = db.collection(companyName).doc("assists").collection("assists")
            .where("date", "==", date)
            .where("idClass", "==", classId);

        const docSnap = await docRef.get();

        if (docSnap.empty) {
            return response;
        }

        // Obtener solo la propiedad 'assists' del documento
        const assistsData = docSnap.docs.map((doc) => doc.data() as IAssists);

        // Filtrar directamente mientras se asigna a response.Items

        response = assistsData.length === 0;

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

        // Referencia al nuevo documento del movimiento dentro de la subcolección
        const assistRef = db
            .collection(companyName)
            .doc("assists")
            .collection("assists")
            .doc(newAssist.id); // Asegúrate de que movement.id esté definido y sea único

        await assistRef.set(newAssist);

        response.setSuccess("asistencia guardada con éxito");
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

        const docRef = db
            .collection(companyName)
            .doc("assists")
            .collection("assists")
            .doc(newAssist.idAssist);

        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            response.setWarning("Asistencia no encontrada");
            return response;
        }

        const currentAssists = docSnap.data() as any;


        if (newAssist.type === 'teacher') {
            if (newAssist.idPersonSustitute) {
                currentAssists.idTeacher = newAssist.idPerson;
                currentAssists.idTeacherSustitute = newAssist.idPersonSustitute;
            } else {
                currentAssists.idTeacher = newAssist.idPerson;
                currentAssists.idTeacherSustitute = '';
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
        await docRef.update(currentAssists);

        response.setSuccess('Asistencia cargada con éxito');
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        response.setError("Error interno del servidor");
    }

    return response;
};
export const getAssistsByStudentId = async (studentId: string): Promise<IAssists[]> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const assistsRef = db.collection(companyName).doc("assists").collection("assists");
    const queries = [
        assistsRef.where("presents", "array-contains", studentId),
        assistsRef.where("missing", "array-contains", studentId),
        assistsRef.where("absent", "array-contains", studentId),
        assistsRef.where("disease", "array-contains", studentId),
        assistsRef.where("proofClass", "array-contains", studentId),
    ];

    const results: IAssists[] = [];

    for (const q of queries) {
        const snap = await q.get();
        snap.forEach((doc) => {
            const data = doc.data() as IAssists;
            // evitar duplicados
            if (!results.find(r => r.id === doc.id)) {
                results.push({ ...data, id: doc.id });
            }
        });
    }

    if (results.length === 0) throw new Error("No se encontraron asistencias");

    return results;
};

export const getAssistsByTeacherId = async (teacherId: string): Promise<IAssists[]> => {
    const companyName = getCompanyName();
    if (!companyName) throw new Error("Company name is not set");

    const assistsRef = db.collection(companyName).doc("assists").collection("assists").where("idTeacher", "==", teacherId);
    const queries = [
        assistsRef.where("presents", "array-contains", teacherId),
        assistsRef.where("missing", "array-contains", teacherId),
        assistsRef.where("absent", "array-contains", teacherId),
        assistsRef.where("disease", "array-contains", teacherId),
        assistsRef.where("proofClass", "array-contains", teacherId),
    ];

    const results: IAssists[] = [];

    for (const q of queries) {
        const snap = await q.get();
        snap.forEach((doc) => {
            const data = doc.data() as IAssists;
            // evitar duplicados
            if (!results.find(r => r.id === doc.id)) {
                results.push({ ...data, id: doc.id });
            }
        });
    }

    if (results.length === 0) throw new Error("No se encontraron asistencias");

    return results;
};

export const getAssistsTakenRepository = async (): Promise<IAssists[]> => {
    const assists: IAssists[] = [];

    try {
        const companyName = getCompanyName();
        if (!companyName) throw new Error("Company name is not set");

        const assistsRef = db
            .collection(companyName)
            .doc("assists")
            .collection("assists");

        // Realizamos una consulta que filtre por cualquier campo que tenga contenido
        const queries = [
            assistsRef.where("presents", "!=", []),
            assistsRef.where("missing", "!=", []),
            assistsRef.where("absent", "!=", []),
            assistsRef.where("disease", "!=", []),
            assistsRef.where("proofClass", "!=", []),
        ];

        const results: IAssists[] = [];

        for (const query of queries) {
            const snap = await query.get();
            snap.forEach(doc => {
                const data = doc.data() as IAssists;
                if (!results.find(r => r.id === doc.id)) {
                    results.push({ ...data, id: doc.id });
                }
            });
        }

        if (results.length === 0) {
            throw new Error("No se encontraron asistencias");
        }

        return results;
    } catch (error) {
        console.error("Error obteniendo asistencias:", error);
        throw new Error("Error interno del servidor");
    }
};


export const getPagedListStudentAssistsRepository = async (search: SearchPagedListHistoryAssistsPersons): Promise<PagedListHistoryAssistsPersons> => {
    const response = new PagedListHistoryAssistsPersons();
    try {
        const nameStudent = await getFullNameStudentById(search.PersonId);
        const assists = await getAssistsByStudentId(search.PersonId);

        if (assists.length === 0) {
            return response;
        }

        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
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
        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
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

        let uniqueClassesId = Array.from(new Set(assists.map((a) => a.idClass)));
        let classesPromise = uniqueClassesId.map(async (id) => await getClassByIdRepository(id));
        let classes = await Promise.all(classesPromise);

        let assist = assists.map((assist: IAssists) => {
            const classe = classes.find((c) => c.id === assist.idClass)!;
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
