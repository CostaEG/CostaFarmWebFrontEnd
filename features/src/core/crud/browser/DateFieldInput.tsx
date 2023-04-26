import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface DateFieldInputProps {
    label?: string;
    fieldName: string;
    require?: boolean;
    min?: string;
    max?: string;
    validate?: (value: string | undefined, allValues: any) => string | undefined;
    disabled?: boolean;
    helperText?: string;
}

export function DateFieldInput({label, fieldName, require, min, max, validate, disabled, helperText = ' '}: DateFieldInputProps) {
    let fieldValidatorBuilder = validator<string | undefined>().date();
    
    if(require) {
        fieldValidatorBuilder = fieldValidatorBuilder.require();
    }
    if(min !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.min(min);
    }
    if(max !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.max(max);
    }

    const fieldValidator = fieldValidatorBuilder.build(validate);

    return (
        <Field<any> name={fieldName} validate={fieldValidator}
            format={(value) => !value ? new Date('Invalid Date') : parseISO(value)}
            parse={(value) => !value || isNaN(value) ? null : formatISO(value)}
            >
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                <FormControl fullWidth>
                    {label && <label className="info-field" htmlFor={name}>{label}</label>}
                    <DatePicker
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        slotProps={{
                            textField: {
                                size: "small",
                                error: Boolean(touched && error),
                                helperText: (touched && error) || helperText,
                                inputProps: {
                                    onBlur,
                                    onFocus
                                }
                            }
                        }}
                    />
                </FormControl>                                            
            )}
        </Field>
    );
}