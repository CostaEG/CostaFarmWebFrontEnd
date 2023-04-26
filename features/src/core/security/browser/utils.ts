import { AppDispatch } from "../../store";
import { SecurityContext } from "../securityModels";
import { securityContextKey, setSecurityContext } from "../securitySlice";

export function login(dispatch: AppDispatch, securityContext: SecurityContext){
    sessionStorage.setItem(securityContextKey, JSON.stringify(securityContext));
    dispatch(setSecurityContext(securityContext));
}

export function logout(dispatch: AppDispatch): void {
    sessionStorage.removeItem(securityContextKey);
    dispatch({ type: 'logout'});
}

export function restoreIdentity(dispatch: AppDispatch) {
    const securityContextCookie = sessionStorage.getItem(securityContextKey);
    if(securityContextCookie)
        dispatch(setSecurityContext(JSON.parse(securityContextCookie)));
}