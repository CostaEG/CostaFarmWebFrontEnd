import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import queryString from 'query-string';
import { manifest } from './manifest';
import { SecurityReducerState, selectSecurityContext } from './security/securitySlice';

const baseQuery = fetchBaseQuery({
    baseUrl: manifest.apiUrl,
    prepareHeaders: (headers: Headers, { getState }) => {
        const securityContext = selectSecurityContext(getState() as SecurityReducerState);
        if (securityContext?.token?.accessToken) {
            headers.set('authorization', `Bearer ${securityContext?.token?.accessToken}`)
        }
        return headers;
    },
    paramsSerializer: params => queryString.stringify(params)
});

let refreshTokenHandler: (refreshToken: string, dispatch: unknown) => Promise<boolean> = _ => {
    return Promise.resolve(false);
}

export function setRefreshTokenHandler(handler: (refreshToken: string, dispatch: unknown) => Promise<boolean>){
    refreshTokenHandler = handler;
}

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {                
        const securityContext = selectSecurityContext(api.getState() as SecurityReducerState);

        if(!securityContext?.token?.refreshToken) {
            return result;
        }

        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {  
                const tokenRefreshed = await refreshTokenHandler(securityContext.token.refreshToken, api.dispatch);

                if(tokenRefreshed) {
                    result = await baseQuery(args, api, extraOptions);
                }
            } 
            finally {
                release()
            }
        } 
        else {            
            await mutex.waitForUnlock();

            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result
}

const tagTypes: string[] = [
    //add cache tags
];

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    tagTypes,
    endpoints: () => ({
        //dynamic injections
    }),
});