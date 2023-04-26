import { ReactNode } from "react";
import { GridHS } from "./Grid";

export function Scene({ children }: { children: ReactNode }) {
    return (
        <GridHS container disableEqualOverflow height="100%">
            {children}
        </GridHS>
    );
}