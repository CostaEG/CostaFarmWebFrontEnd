import { Autocomplete, CircularProgress, FormControl, TextField } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface SelectObjectFieldInputProps<TOption> {
    label?: string;    
    fieldName: string;
    multiple?: boolean;
    isFetching?: boolean;
    options: TOption[] | undefined;
    getOptionValue: (option: TOption) => number;
    getOptionLabel: (option: TOption) => string;
    require?: boolean;
    validate?: (value: TOption | TOption[], allValues: any) => string | undefined;
    validateAsync?: (value: TOption | TOption[], allValues: any) => Promise<string | undefined>;
    disabled?: boolean;    
    helperText?: string;
    placeholder?: string;
}

export function SelectObjectFieldInput<TOption>({label, fieldName, multiple, isFetching, options, getOptionValue, getOptionLabel, require, validate, validateAsync, disabled, helperText = ' ', placeholder}: SelectObjectFieldInputProps<TOption>) {
    let fieldValidatorBuilder = require ? validator<TOption | TOption[]>().require() : validator<TOption | TOption[]>();

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);
    
    return (
        <Field<TOption | TOption[]> name={fieldName} validate={fieldValidator}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => {             
                if(value && multiple && !(value instanceof Array))
                    throw new Error('Invalid value. Value must be instance of Array');

                if(value && !multiple && value instanceof Array)
                    throw new Error('Invalid value. Value must not be instance of Array');

                return (
                    <FormControl fullWidth>
                        {label && <label className="info-field" htmlFor={name}>{label}{(isFetching || validating) && <CircularProgress size={12} sx={{ml: 1}}/>}</label>}
                        <Autocomplete
                            disabled={disabled}
                            loading={isFetching}
                            placeholder={placeholder}
                            size="small"
                            fullWidth
                            multiple={multiple}
                            disableCloseOnSelect={multiple}
                            options={options || []}
                            getOptionLabel={getOptionLabel}
                            isOptionEqualToValue={(a, b) => getOptionValue(a) === getOptionValue(b)}
                            value={value || null}
                            onChange={(_, newValue) => {
                                onChange(newValue);
                            }}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            renderInput={(params) => <TextField 
                                {...params} 
                                error={Boolean(touched && error)}
                                helperText={(touched && error) || helperText}
                            />
                        }/>
                    </FormControl>                                            
                );
            }}
        </Field>
    );
}