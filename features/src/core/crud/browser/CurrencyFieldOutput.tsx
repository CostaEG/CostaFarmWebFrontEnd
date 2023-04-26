import { Stack } from "@mui/material";
import { FormattedCurrency } from "../../formatting/FormattedCurrency";

interface CurrencyFieldOutputProps {
    label: string;
    value: number | undefined;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export function CurrencyFieldOutput({ value, label, minimumFractionDigits, maximumFractionDigits }: CurrencyFieldOutputProps) {
    return (
        <Stack>
            <label className="info-field">{label}</label>
            <label>
                {
                    value === undefined
                        ? '-'
                        : <FormattedCurrency value={value} minimumFractionDigits={minimumFractionDigits} maximumFractionDigits={maximumFractionDigits} />
                }
            </label>
        </Stack>
    );
}