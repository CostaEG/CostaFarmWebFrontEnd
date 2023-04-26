export type IdType = string | number;

export interface Entity<T extends IdType = number> {
    id: T;
    rowVersion?: number[];

    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    archivedBy?: string;
}

export interface Filter {
    search: string;
    archived?: boolean;
    top: number;
	skip: number;
        
	Select?: string;
	OrderBy?: string;

    RefreshToken?: number;
}

export interface ValueDescriptor<T> {
    value: T,
    label: string
}

export interface NormalizedValues<TId extends IdType, TValue> {
    list: TValue[];
    ids: TId[],
    values: { [key: IdType]: TValue };
}

export function normalizeValues<TId extends IdType, TValue>(list: TValue[], getId: (value: TValue) => TId){
    const normalizedValues: NormalizedValues<TId, TValue> = {
        list,
        ids: list.map(x => getId(x)),
        values: {}
    };

    list.forEach(x => normalizedValues.values[getId(x)] = x);

    return normalizedValues;
}

export function normalizeIdValues<TId extends IdType>(list: ValueDescriptor<TId>[]){
    return normalizeValues<TId, ValueDescriptor<TId>>(list, x => x.value);
}

export interface ErrorPayload {
    status: number | string;
    data?: ProblemDetails
}

export interface ProblemDetails {
    title?: string;
    detail?: string;
    errors?: ValidationFailure[];
}

export interface ValidationFailure {
    code?: string;
    parameters?: any[];
    children?: ValidationFailure[];
}