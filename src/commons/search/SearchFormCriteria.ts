import {CriteriaOperator} from "./CriteriaOperator";

export interface SearchFormCriteria {
    fieldName: string;
    value: any;
    operator: CriteriaOperator;
}