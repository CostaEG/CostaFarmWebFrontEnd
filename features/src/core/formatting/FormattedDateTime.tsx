import formatFn from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useMemo } from "react";

interface FormattedDateTimeProps {
    value: Date | string;
    variant: "date" | "time" | "datetime" | "custom";
    format?: "short" | "long";
    customFormat?: string
}

const formats = {
    date: {
        short: 'P',
        long: 'PP'
    },
    time: {
        short: 'p',
        long: 'pp'
    },
    datetime: {
        short: 'Pp',
        long: 'PPpp'
    }
};

//date-fns default locale is en-US
export function FormattedDateTime({ value, variant, format, customFormat } : FormattedDateTimeProps) {
    const normalizedValue = useMemo(() => {        
        if(!value)
            return undefined;
        
        if(value instanceof Date)
            return value;
            
        return parseISO(value);
    }, [value]);

    const formattedValue = useMemo(() => {
        if(!normalizedValue)
            return '-';

        let normalizedFormat: string;
        
        if(variant === "custom"){
            normalizedFormat = customFormat || formats.date.short;
        }
        else {
            normalizedFormat = formats[variant][format || "short"];
        }

        return formatFn(normalizedValue, normalizedFormat);
    }, [normalizedValue, variant, format, customFormat]);

    return <>{formattedValue}</>;
}