import { useMemo } from "react";
import { locale } from "./defaultLocale";

interface FormattedNumberProps {
    value: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    percent?: boolean;
}

export function FormattedNumber({ value, minimumFractionDigits, maximumFractionDigits, percent }: FormattedNumberProps) {
    const formattedValue = useMemo(() => {
        return value.toLocaleString(locale, {
            style: percent ? 'percent' : 'decimal',
            minimumFractionDigits,
            maximumFractionDigits
        });
    }, [value, minimumFractionDigits, maximumFractionDigits, percent]);

    return <>{formattedValue}</>;
}
