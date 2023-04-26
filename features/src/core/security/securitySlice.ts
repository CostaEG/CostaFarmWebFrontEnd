import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SecurityContext } from './securityModels';

export const securityContextKey = "hs-security-context";

export interface SecurityState {
    context: SecurityContext | undefined;
}

const initialState: SecurityState = {
    context: undefined
};

export type SecurityReducerState = {
    security: SecurityState
}

export const securitySlice = createSlice({
    name: "security",
    initialState,
    reducers: {
        setSecurityContext: (state, action: PayloadAction<SecurityContext | undefined>) => {
            state.context = action.payload;
        }
    }
});

export const securityRegistration = {
    reducer: securitySlice.reducer
};

export const { setSecurityContext } = securitySlice.actions;

export const selectIsAuthenticated = (state: SecurityReducerState) =>
    state.security.context?.identity?.id
    && (state.security.context?.token?.expiresAt || 0 > Math.floor(Date.now() / 1000));

export const selectSecurityContext = (state: SecurityReducerState) => state.security.context;

export function matchScopes(scopes?: string[], securityContext?: SecurityContext) {
    return !scopes || !securityContext?.scopes || securityContext.scopes.some(s => scopes?.some(x => x === s))
}