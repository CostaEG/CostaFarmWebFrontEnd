import { FORM_ERROR } from "final-form";
import { ErrorPayload, ValidationFailure } from "../models";

export function validator<T>(...rules: ((value: T, allValues: any) => (undefined | string))[]) {
    return {
        require: () => validator(...rules, value => value || value === 0 ? undefined : 'Required'),
        min: (min: number | string) => validator(...rules, value => value >= min ? undefined : `Must be greater than ${min}`),
        max: (max: number | string) => validator(...rules, value => value <= max ? undefined : `Must be less than ${max}`),   
        date: () => validator(...rules, value => !value || (value >= '1800-01-01' && value <= '2500-01-01') ? undefined : 'Invalid'),           
        number: () => validator(...rules, value => typeof value === 'number' ? undefined : 'Invalid'),           
        must: (rule?: (value: T, allValues: any) => (undefined | string)) => rule ? validator(...rules, rule) : validator(...rules),        
        build: (next?: (value: T, allValues: any) => string | undefined | Promise<string | undefined>) => (value: T, allValues: any) => {
            for(let i = 0; i < rules.length; i++){
                let error = rules[i](value, allValues);
                if(error) {
                    return error;
                }
            }            
            return next ? next(value, allValues) : undefined;
        }
    }
}

const floatCheckerRegex = /^(-|\+)?([0-9]*((\.|,)[0-9]*)?)$/;

export function floatChecker(str: string) {
    return floatCheckerRegex.test(str);
}

export function floatParser(str: string) {
    if(!str)
        return null;

    const normalizeStr = str.replace(',', '.');

    if(normalizeStr.endsWith('.'))
        return null;

    const val = parseFloat(normalizeStr);
    
    return isNaN(val) ? null : val;
};

const integerCheckerRegex = /^(-|\+)?([0-9]*)$/;

export function integerChecker(str: string) {
    return integerCheckerRegex.test(str);
}

export function integerParser(str: string)
{
    if(!str)
        return null;

    const val = parseInt(str);
    return isNaN(val) ? null : val;
};

export function isNetworkError(error?: any){
    return error?.status === "FETCH_ERROR";
}

export function getErrorMessage(error?: any, defaultErrorMessage?: string, getValidationMessage?: (error: ValidationFailure) => string) : string | string[]{
    if(isNetworkError(error))
        return 'Network error';
    
    const errorDetails = error as ErrorPayload;
    
    const validationErrors = errorDetails?.data?.errors || [];

    if(validationErrors.length > 0) {
        let errors: string[] = [];
        
        validationErrors.forEach(x => {
            if(x.code){
                errors.push((getValidationMessage && getValidationMessage(x)) || x.code);
            }
        });

        if(errors.length === 1) {
            return errors[0];
        }

        if(errors.length > 1) {
            return errors;
        }
    }

    return errorDetails?.data?.detail || errorDetails?.data?.title || defaultErrorMessage || 'Operation Error';
}

export function getFormErrorMessage(error?: any, defaultErrorMessage?: string, getValidationMessage?: (error: ValidationFailure) => string) {
    return ({ 
        [FORM_ERROR]: getErrorMessage(error, defaultErrorMessage, getValidationMessage)
    });
}