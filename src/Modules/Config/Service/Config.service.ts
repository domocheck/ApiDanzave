import { ConfigContactsPagedList } from "../../Contacts/Models/Contacts-paged-list.modelst";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";
import { Config, Price, Ranges, Reference } from "../Models/Config.models";
import { PagedListPrices, SearchPagedListPrices } from "../Models/Price-paged-list.model";
import { changeStatusPriceRepository, getConfigRepository, getContactsMediaFromConfigRepository, getPagedListPricesRepository, getPaymentsMethodsFromConfigRepository, getRangesFromConfigRepository, getReasonsFromConfigRepository, getReferencesFromConfigRepository, saveItemsToSeeRepository, savePaymentMethodRepository, savePriceRepository, saveRangeHoursRepository, saveRangeStudentsRepository, saveReferenceRepository } from "../Repository/Config.repository";

export const getReasonsService = async (): Promise<Config> => {
    let response = new Config();
    response.Items.reasons = await getReasonsFromConfigRepository();
    return response;
}

export const getPaymentsMethodsService = async (): Promise<Config> => {
    let response = new Config();
    response.Items.paymentsMethods = await getPaymentsMethodsFromConfigRepository();
    return response;
}

export const getConfigFromContactsPagedListService = async (): Promise<ConfigContactsPagedList> => {
    let response = new ConfigContactsPagedList();
    try {
        const [references, contactsMedia] = await Promise.all([
            getReferencesFromConfigRepository(),
            getContactsMediaFromConfigRepository()
        ])
        response.References = references;
        response.ContactsMedia = contactsMedia;
    } catch (error: any) {
        response.setError(error.message);
        return response;
    }

    return response;
}

export const getConfigService = async (): Promise<Config> => {
    return await getConfigRepository();
}

export const saveItemsToSeeService = async (quantity: number): Promise<ResponseMessages> => {
    try {
        return await saveItemsToSeeRepository(quantity);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const savePaymentMethodService = async (paymentName: string, paymentId: string): Promise<ResponseMessages> => {
    try {
        return await savePaymentMethodRepository(paymentName, paymentId);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const saveReferenceService = async (referenceId: string, referenceName: string, type: string): Promise<ResponseMessages> => {
    try {
        return await saveReferenceRepository(referenceId, referenceName, type);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const saveRangeHoursService = async (index: number, initialHour: number, finalHour: number): Promise<ResponseMessages> => {
    try {
        return await saveRangeHoursRepository(index, initialHour, finalHour);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const saveRangeStudentsService = async (value: number, range: keyof Ranges): Promise<ResponseMessages> => {
    try {
        return await saveRangeStudentsRepository(value, range);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const savePriceService = async (price: Price, type: string): Promise<ResponseMessages> => {
    try {
        return await savePriceRepository(price, type);
    } catch (error: any) {
        let response = new ResponseMessages();
        response.setError(error.message);
        return response;
    }

}

export const getPagedListPricesService = async (search: SearchPagedListPrices): Promise<PagedListPrices> => {
    return await getPagedListPricesRepository(search);
}

export const changeStatusPriceService = async (priceId: string, type: string): Promise<ResponseMessages> => {

    return await changeStatusPriceRepository(priceId, type);
}
