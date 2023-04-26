import { configureStore, ThunkAction, Action, combineReducers, Reducer, AnyAction, Dictionary } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { api } from './service';
import { securityRegistration } from './security/securitySlice';
import { layoutRegistration } from './layout/layoutSlice';

const staticReducers = {
    [api.reducerPath]: api.reducer,
    security: securityRegistration.reducer,
    layout: layoutRegistration.reducer
}

const asyncReducers: { [idx: string]: Reducer<any, any> } = {
    //dynamic injections
};

function createRootReducer() {
    const combinedReducer = combineReducers({
        ...staticReducers,
        ...asyncReducers
    });

    return (state: any, action: any) => {
        if (action.type === 'logout') {
            state = undefined;
        }        
        return combinedReducer(state, action);
    }
}

export const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(layoutRegistration.errorMiddleware)
});

setupListeners(store.dispatch)

export function configureReducer<TReducerState extends Dictionary<any>>(reducerState: TReducerState) {
    return {
        name: Object.keys(reducerState)[0],
        getState: () => reducerState
    };
}

export function injectReducer<S = any, A extends Action = AnyAction>(key: string, reducer: Reducer<S, A>) {
    asyncReducers[key] = reducer;

    store.replaceReducer(createRootReducer());
}

export type AppDispatch = typeof store.dispatch;

export type AppThunk<TReducerState> = ThunkAction<
    void,
    TReducerState,
    unknown,
    Action<string>
>;
