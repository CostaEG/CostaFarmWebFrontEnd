import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { matchScopes, selectIsAuthenticated, selectSecurityContext } from './security/securitySlice';
import type { AppDispatch } from './store'

export const useAppSelector = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useSecurityContext = () => useSelector(selectSecurityContext);

export const useIsAuthenticated = () => useSelector(selectIsAuthenticated);

export const useIsAuthorized = (scopes?: string[]) => {
  const securityContext = useSecurityContext();

  const authorized = useMemo(
      () => matchScopes(scopes, securityContext),
      [scopes, securityContext]
  );

  return authorized;
};

export const useDebounce = <T>(value: T, delay: number = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
}
