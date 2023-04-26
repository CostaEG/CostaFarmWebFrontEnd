import { AppDispatch } from '../../store';
import { SecurityContext } from '../securityModels';
import { setSecurityContext, securityContextKey } from '../securitySlice';
import storage from '@react-native-async-storage/async-storage';

export function login(dispatch: AppDispatch, securityContext: SecurityContext){
    storage.setItem(securityContextKey, JSON.stringify(securityContext));
    dispatch(setSecurityContext(securityContext));
}

export function logout(dispatch: AppDispatch): void {
    storage.removeItem(securityContextKey);
    dispatch({ type: 'logout'});
}

export async function restoreIdentityAsync(dispatch: AppDispatch) {
    const serializedSecurityContext = await storage.getItem(securityContextKey);
    if(serializedSecurityContext)
        dispatch(setSecurityContext(JSON.parse(serializedSecurityContext)));
}