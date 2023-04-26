import { Stack } from "@mui/material";

interface BooleanFieldOutputProps {
    label: string;
    value: boolean | undefined;
}

export function BooleanFieldOutput({ value, label }: BooleanFieldOutputProps){
    return (
        <Stack>
            <label className="info-field">{label}</label>
            <label>{value === true ? 'Yes' : 'No'}</label>
        </Stack>
    );
}