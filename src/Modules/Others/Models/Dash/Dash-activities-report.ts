import { ActivitiesToStats, ActivityToStat } from "../../../Contacts/Models/Contact.models";
import { ResponseMessages } from "../ResponseMessages";

export class DashActivitiesReport extends ResponseMessages {
    Completes: ActivityToStat[] = [];
    ToCompleteToday: ActivityToStat[] = [];
    ToComplete: ActivityToStat[] = [];
}