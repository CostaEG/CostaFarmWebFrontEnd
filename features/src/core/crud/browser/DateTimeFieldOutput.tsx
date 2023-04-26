import { Stack } from "@mui/material";
import { FormattedDateTime } from "../../formatting/FormattedDateTime";

interface DateTimeFieldOutputProps {
    label: string;
    value: Date | string | undefined;
    variant: "date" | "time" | "datetime" | "custom";
    format?: "short" | "long";
    customFormat?: string
}

export function DateTimeFieldOutput({ value, label, variant, format, customFormat }: DateTimeFieldOutputProps) {
    return (
        <Stack>
            <label className="info-field">{label}</label>
            <label>
                {
                    value === undefined
                        ? '-'
                        : <FormattedDateTime value={value} variant={variant} format={format} customFormat={customFormat} />
                }
            </label>
        </Stack>
    );
}