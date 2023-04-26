import { Stack } from "@mui/material";

interface CollectionFieldOutputProps {
    label: string;
    value: string[] | undefined;
    emptyText?: string;
}

export function CollectionFieldOutput({ value, label, emptyText }: CollectionFieldOutputProps) {
    return (
        <Stack>
            <label className="info-field">{label}</label>
            {
                value && value.length > 0
                    ? <ul>
                        {value.map((x, i) => (<li key={i}>{x}</li>))}
                    </ul>
                    : <label>{emptyText || 'No results found'}</label>
            }
        </Stack>
    );
}