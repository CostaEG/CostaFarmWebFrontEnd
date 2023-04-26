import { CircularProgress, FormControl, TextField } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface StringFieldInputProps {
    label?: string;
    fieldName: string;
    require?: boolean;
    validate?: (value: string, allValues: any) => string | undefined;
    validateAsync?: (value: string, allValues: any) => Promise<string | undefined>;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;    
    helperText?: string;
    placeholder?: string;
}

export function StringFieldInput({label, fieldName, require, validate, validateAsync, disabled, multiline, rows, helperText = ' ', placeholder}: StringFieldInputProps) {
    let fieldValidatorBuilder = require ? validator<string>().require() : validator<string>();

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);

    return (
        <Field<string> name={fieldName} validate={fieldValidator}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => (
                <FormControl fullWidth>
                    {label && <label className="info-field" htmlFor={name}>{label}{validating && <CircularProgress size={12} sx={{ml: 1}}/>}</label>}
                    <TextField
                        size="small"
                        multiline={multiline}
                        rows={rows}
                        disabled={disabled}
                        fullWidth
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        error={Boolean(touched && error)}
                        helperText={(touched && error) || helperText}
                        onChange={onChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                    />                                                    
                </FormControl>                                                
            )}
        </Field>
    );
}