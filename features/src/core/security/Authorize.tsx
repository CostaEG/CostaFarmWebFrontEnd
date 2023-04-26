import { ReactNode } from "react";
import { useIsAuthorized } from "../hooks";

interface AuthorizeProps {
    scopes?: string[];
    UnauthorizedComponent: () => JSX.Element;
    children: ReactNode;
}

export default function Authorize({ scopes, UnauthorizedComponent, children }: AuthorizeProps) {
    const authorized = useIsAuthorized(scopes);

    if (!authorized)
        return (
            <UnauthorizedComponent />
        );

    return (
        <>
            {children}
        </>
    );
}