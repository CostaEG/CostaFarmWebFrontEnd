import { useMemo } from "react";
import { locale } from "./defaultLocale";

interface FormattedCurrencyProps {
    value: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export function FormattedCurrency({ value, minimumFractionDigits, maximumFractionDigits }: FormattedCurrencyProps) {
    const formattedValue = useMemo(() => {
        return value.toLocaleString(locale, {
            style: 'currency', currency: 'USD',
            minimumFractionDigits,
            maximumFractionDigits
        });
    }, [value, minimumFractionDigits, maximumFractionDigits]);

    return <>{formattedValue}</>;
}
