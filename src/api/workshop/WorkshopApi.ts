import {SearchForm} from "../../commons/search/SearchForm.ts";
import {SearchResponse} from "../../commons/search/SearchResponse.ts";
import {WorkshopDto} from "./response/WorkshopDto.ts";
import {CreateWorkshopForm} from "./form/CreateWorkshopForm.ts";
import {EditWorkshopForm} from "./form/EditWorkshopForm.ts";

export interface WorkshopApi {
    search(form: SearchForm): Promise<SearchResponse<WorkshopDto>>;
    create(form: CreateWorkshopForm): Promise<WorkshopDto>;
    edit(id: string, form: EditWorkshopForm): Promise<WorkshopDto>;
    delete(id: string): Promise<void>;
    get(id: string): Promise<WorkshopDto>;
}