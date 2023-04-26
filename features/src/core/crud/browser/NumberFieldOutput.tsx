import { Stack } from "@mui/material";
import { FormattedNumber } from "../../formatting/FormattedNumber";

interface NumberFieldOutputProps {
    label: string;
    value: number | undefined;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    unit?: string;
    unitPosition?: "start" | "end"
}

export function NumberFieldOutput({ value, label, minimumFractionDigits, maximumFractionDigits, unit, unitPosition }: NumberFieldOutputProps) {
    return (
        <Stack>
            <label className="info-field">{label}</label>
            <label>
                {
                    value === undefined
                        ? '-'
                        : <>
                            {unit && unitPosition === "start" && `${unit} `}
                            <FormattedNumber value={value} minimumFractionDigits={minimumFractionDigits} maximumFractionDigits={maximumFractionDigits} />
                            {unit && unitPosition !== "start" && ` ${unit}`}
                        </>
                }
            </label>
        </Stack>
    );
}