import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Field } from "react-final-form";

interface SelectBooleanFieldInputProps {
    label?: string;
    fieldName: string;
    validate?: (value: boolean | undefined, allValues: any) => string | undefined;
    disabled?: boolean;
    helperText?: string;
    placeholder?: string;
}

const options = ['Yes', 'No'];

export function SelectBooleanFieldInput({ label, fieldName, validate, disabled, helperText = ' ', placeholder }: SelectBooleanFieldInputProps) {

    return (
        <Field<boolean | undefined> name={fieldName} validate={validate}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                <FormControl fullWidth>
                    {label && <label className="info-field" htmlFor={name}>{label}</label>}
                    <Autocomplete
                        disabled={disabled}
                        placeholder={placeholder}
                        size="small"
                        fullWidth
                        options={options}
                        getOptionLabel={x => x}
                        value={value === true ? 'Yes' : (value === false ? 'No' : null)}
                        onChange={(_, newValue) => {
                            onChange(newValue === undefined || newValue === null ? null : (newValue === 'Yes' ? true : false));
                        }}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        renderInput={(params) => <TextField
                            {...params}
                            error={Boolean(touched && error)}
                            helperText={(touched && error) || helperText}
                        />
                        } />
                </FormControl>
            )}
        </Field>
    );
}