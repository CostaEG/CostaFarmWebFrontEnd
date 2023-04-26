import { AnyAction, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { Filter, Entity } from "../models";

export function patchFilterSliceFactory<TFilter extends Filter, TState extends { filter: TFilter}>() {
    return (state: TState, action: PayloadAction<Partial<TFilter>>) => {
        state.filter = { ...state.filter, ...action.payload };
    };
}

export function filterServiceFactory<TModel extends Entity, TFilter extends Filter>(build: EndpointBuilder<BaseQueryFn, any, string>, serviceBaseUrl: string) {
    return build.query<TModel[], TFilter | undefined>({
        query: (filter) => ({
            url: serviceBaseUrl,
            params: filter
        }),
        serializeQueryArgs: ({ endpointName }) => endpointName,
        merge: (currentCache, newItems, { arg: filter }) => {
            if (!Boolean(filter?.skip))
                currentCache.splice(0, currentCache.length);

            currentCache.push(...newItems)
        },
        forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    });
}

export function getByIdServiceFactory<TModel extends Entity>(build: EndpointBuilder<BaseQueryFn, any, string>, serviceBaseUrl: string) {
    return build.query<TModel, number>({
        query: (id) => ({
            url: `${serviceBaseUrl}/${id}`
        }),
    });
}

export function addOrUpdateServiceFactory<TModel extends Entity>(
    build: EndpointBuilder<BaseQueryFn, any, string>, 
    serviceBaseUrl: string, 
    updateQueryData: (dispatch: ThunkDispatch<any, any, AnyAction>, handler: (model: TModel[]) => void) => any
) {
    return build.mutation<Entity, TModel>({
        query: (entity) => ({
            url: serviceBaseUrl,
            method: entity.id > 0 ? 'PUT' : 'POST',
            body: entity
        }),
        onQueryStarted: async (entity, { dispatch, queryFulfilled }) => {
            const { data: IdAndRowVersion } = await queryFulfilled;

            updateQueryData(dispatch, (draft) => {
                let index = draft.findIndex(x => x.id === IdAndRowVersion.id);
                if(index >= 0) {
                    draft.splice(index, 1, Object.assign({}, entity, IdAndRowVersion));
                }
                else {
                    draft.unshift(Object.assign({}, entity, IdAndRowVersion));
                }
            });
        }
    });
}

export function archiveServiceFactory<TModel extends Entity>(
    build: EndpointBuilder<BaseQueryFn, any, string>, 
    serviceBaseUrl: string, 
    updateQueryData: (dispatch: ThunkDispatch<any, any, AnyAction>, handler: (model: TModel[]) => void) => any
) {
    return build.mutation<Entity, TModel>({
        query: (entity) => ({
            url: `${serviceBaseUrl}/${entity.id}`,
            method: 'DELETE',            
            body: { toJSON: () => entity.rowVersion }
        }),
        
        onQueryStarted: async (entity, { dispatch, queryFulfilled }) => {
            const { data: IdAndRowVersion } = await queryFulfilled;

            if(entity.id === IdAndRowVersion.id) {
                updateQueryData(dispatch, (draft) => {
                    let index = draft.findIndex(x => x.id === IdAndRowVersion.id);
                    if(index >= 0) {
                        draft.splice(index, 1);
                        //draft.splice(index, 1, Object.assign({}, entity, IdAndRowVersion, { archivedBy: '-' }));
                    }
                });
            }
        }
    });
}

export function recoverServiceFactory<TModel extends Entity>(
    build: EndpointBuilder<BaseQueryFn, any, string>, 
    serviceBaseUrl: string, 
    updateQueryData: (dispatch: ThunkDispatch<any, any, AnyAction>, handler: (model: TModel[]) => void) => any
) {
    return build.mutation<Entity, TModel>({
        query: (entity) => ({
            url: `${serviceBaseUrl}/${entity.id}/recover`,
            method: 'POST', 
            body: { toJSON: () => entity.rowVersion }
        }),
        onQueryStarted: async (entity, { dispatch, queryFulfilled }) => {
            const { data: IdAndRowVersion } = await queryFulfilled;

            if(entity.id === IdAndRowVersion.id) {
                updateQueryData(dispatch, (draft) => {
                    let index = draft.findIndex(x => x.id === IdAndRowVersion.id);
                    if(index >= 0) {
                        draft.splice(index, 1, Object.assign({}, entity, IdAndRowVersion, { archivedBy: null }));
                    }
                    else {
                        draft.unshift(Object.assign({}, entity, IdAndRowVersion, { archivedBy: null }));
                    }
                });
            }
        }
    });
}