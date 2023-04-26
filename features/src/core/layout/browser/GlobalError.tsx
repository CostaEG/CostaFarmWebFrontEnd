import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectGlobalError, setGlobalError } from "../layoutSlice";
import { SnackbarNotification } from "./SnackbarNotification";

export default function GlobalError() {
    const dispatch = useAppDispatch();
    const globalError = useAppSelector(selectGlobalError);

    if(!globalError)
        return null;

    return (
        <SnackbarNotification 
            severity="error" 
            message={globalError}
            onClosed={() => dispatch(setGlobalError(undefined))}
        />
    );
}