import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectGlobalError, setGlobalError } from "../layoutSlice";
import { ErrorNotification } from "./ErrorNotification";

export default function GlobalError() {
    const dispatch = useAppDispatch();
    const globalError = useAppSelector(selectGlobalError);

    if(!globalError)
        return null;

    return (
        <ErrorNotification 
            errorMessage={globalError} 
            onClosed={() => dispatch(setGlobalError(undefined))}
        />
    );
}