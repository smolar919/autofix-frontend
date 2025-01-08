import {SearchFormCriteria} from "./SearchFormCriteria";
import {SearchSort} from "./SearchSort";

export interface SearchForm {
    criteria: SearchFormCriteria[];
    page: number;
    size: number;
    sort: SearchSort;
}