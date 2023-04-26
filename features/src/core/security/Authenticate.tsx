import { ReactNode } from "react";
import { useIsAuthenticated } from "../hooks";

interface AuthenticateProps {
    LoginComponent: () => JSX.Element;
    children: ReactNode;
}

export function Authenticate({ LoginComponent, children }: AuthenticateProps) {
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) {
       return <LoginComponent />;
    }

    return (
        <>
            {children}
        </>
    );
}