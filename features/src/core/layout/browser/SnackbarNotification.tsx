import { Alert, AlertColor, AlertTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

interface SnackbarNotificationProps {
    severity: AlertColor;
    title?: string;
    message: string | string[]; 
    autoHideDuration?: number;   
    onClosed?: () => void;
}

export function SnackbarNotification({ severity, title, message, onClosed, autoHideDuration = 10000 } : SnackbarNotificationProps) {
    const [ open, setOpen ] = useState(Boolean(message));
    const onClose= (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        onClosed && onClosed();
    }

    useEffect(() => {
        setOpen(Boolean(message));
    }, [message])

    return (
        <Snackbar 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}            
            autoHideDuration={autoHideDuration} 
            onClose={onClose}>
            <Alert severity={severity} onClose={onClose}>
                    { title && <AlertTitle>{title}</AlertTitle>}
                    {
                        message instanceof Array
                            ?   <ul>
                                    {message.map((x, i) => <li key={i}>{x}</li>)}
                                </ul>
                            : message
                    }
            </Alert>
        </Snackbar> 
   );
}

