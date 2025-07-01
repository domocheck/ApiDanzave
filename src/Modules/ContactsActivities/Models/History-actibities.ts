import { HistoryActivity } from "../../Contacts/Models/Contact.models";
import { ResponseMessages } from "../../Others/Models/ResponseMessages";

export class HistoryActivities extends ResponseMessages {
    History: HistoryActivity[] = [];
}