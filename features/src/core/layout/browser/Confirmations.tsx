import { Alert, Box, Button, Checkbox, FormControlLabel, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-final-form";

interface ConfirmationModalProps {
    title?: string;
    message: string;
    acknowledgeMessage?: string;
    yes: () => void;
    no: () => void;
}

const boxStyles = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    minWidth: 350,
    maxWidth: 500,
    py: 2,
    px: 4
};

export function ConfirmationModal({ title, message, acknowledgeMessage, yes, no } : ConfirmationModalProps) {
    const acknowledgeRequired = Boolean(acknowledgeMessage);
    const [acknowledge, setAcknowledge] = useState(!acknowledgeRequired);

    return (
        <Modal open={true} disableAutoFocus disableEnforceFocus>
            <Box sx={boxStyles}>
                <Stack alignItems="center" spacing={1} mt={1}>
                    <Typography variant="h6">{title || 'Confirmation'}</Typography>
                    <Typography>{message}</Typography>
                    {
                        acknowledgeRequired && 
                        <Box>
                            <Alert severity="warning" icon sx={{ mt: 2 }}>
                                <FormControlLabel control={<Checkbox checked={acknowledge} onChange={() => setAcknowledge(!acknowledge)} />} label={acknowledgeMessage}/>
                            </Alert> 
                        </Box>
                    }
                </Stack>
                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="contained" disabled={!acknowledge} color="success" onClick={yes}>Yes</Button>
                    <Button variant="contained" color="error" onClick={no}>No</Button>
                </Stack>
            </Box>
        </Modal>
    )
}

interface ButtonWithConfirmationProps {
    text: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    disabled?: boolean;    

    confirmationTitle?: string;
    confirmationMessage: string;
    acknowledgeMessage?: string;
    onConfirm: () => void;    
}

export function ButtonWithConfirmation({ text, color, disabled, confirmationTitle, confirmationMessage, acknowledgeMessage, onConfirm}: ButtonWithConfirmationProps){
    const [confirmation, setConfirmation] = useState(false);
    
    return <>
        {confirmation && <ConfirmationModal 
            title={confirmationTitle}
            message={confirmationMessage}
            acknowledgeMessage={acknowledgeMessage}
            yes={() => {
                setConfirmation(false);
                onConfirm();
            }}
            no={() => setConfirmation(false)}
        />}
        <Button 
            variant="contained" 
            color={color}
            disabled={disabled} 
            onClick={() => setConfirmation(true)}>
                {text}
        </Button>
    </>
}

interface SubmitWithConfirmationProps {
    text: string;
    disabled?: boolean;    

    confirmationTitle?: string;
    confirmationMessage: string;
    acknowledgeMessage?: string;
}

export function SubmitWithConfirmation({ text, disabled, confirmationTitle, confirmationMessage, acknowledgeMessage }: SubmitWithConfirmationProps){
    const form = useForm();

    return (
        <ButtonWithConfirmation
            text={text}
            color="success"
            disabled={disabled}
            confirmationTitle={confirmationTitle}
            confirmationMessage={confirmationMessage}
            acknowledgeMessage={acknowledgeMessage}
            onConfirm={() => form.submit()}
        />
    );
}
