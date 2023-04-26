import { Stack } from "@mui/material";

interface StringFieldOutputProps {
    label: string;
    value: string | undefined;
    multiline?: boolean;
}

export function StringFieldOutput({ value, label, multiline }: StringFieldOutputProps){
    return (
        <Stack>
            <label className="info-field">{label}</label>
            {
                multiline ? <pre>{value || '-'}</pre> : <label>{value || '-'}</label>
            }
        </Stack>
    );
}