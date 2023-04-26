import { CircularProgress, FormControl, InputAdornment, TextField } from "@mui/material";
import { Field } from "react-final-form";
import { floatChecker, floatParser, integerChecker, integerParser, validator } from "../../form/validation";

interface NumberFieldInputProps {
    variant?: "integer" | "decimal"
    label?: string;
    fieldName: string;
    min?: number;
    max?: number;
    validate?: (value: number, allValues: any) => string | undefined;
    validateAsync?: (value: number, allValues: any) => Promise<string | undefined>;
    unit?: string;
    unitPosition?: "start" | "end"
    disabled?: boolean;
    helperText?: string;
    placeholder?: string;
}

export function NumberFieldInput({variant, label, fieldName, min, max, validate, validateAsync, unit, unitPosition, disabled, helperText = ' ', placeholder}: NumberFieldInputProps) {
    let fieldValidatorBuilder = validator<number>().require().number();
    
    if(min !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.min(min);
    }
    if(max !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.max(max);
    }

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);

    return (
        <Field<any> name={fieldName} validate={fieldValidator} parse={(value) => {
            let normalizedValue = variant === "integer" ? integerParser(value) : floatParser(value);
            if(normalizedValue === null)
                return value;                                                    
            return normalizedValue;
        }}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => (
                <FormControl fullWidth>
                    {label && <label className="info-field" htmlFor={name}>{label}{validating && <CircularProgress size={12} sx={{ml: 1}}/>}</label>}
                    <TextField
                        placeholder={placeholder}
                        size="small"
                        disabled={disabled}
                        fullWidth
                        name={name}
                        value={value}
                        error={Boolean(touched && error)}
                        helperText={(touched && error) || helperText}
                        onChange={({ target: { value }})=> {
                            const valid = variant === "integer" ? integerChecker(value) : floatChecker(value);
                            if(valid)
                                onChange(value)
                        }}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        InputProps={{
                            startAdornment: unit && unitPosition === "start" && <InputAdornment position="start">{unit}</InputAdornment>,
                            endAdornment: unit && unitPosition !== "start" && <InputAdornment position="end">{unit}</InputAdornment>,
                        }}
                    />                                                    
                </FormControl>                                                    
            )}
        </Field>
    );
}