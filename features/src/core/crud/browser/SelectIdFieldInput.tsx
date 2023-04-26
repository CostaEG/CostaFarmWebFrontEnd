import { Autocomplete, CircularProgress, FormControl, TextField } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface SelectIdFieldInputProps<TOption> {
    label?: string;    
    fieldName: string;
    multiple?: boolean;
    isFetching?: boolean;
    options: TOption[] | undefined;
    getOptionValue: (option: TOption) => number;
    getOptionLabel: (option: TOption) => string;
    require?: boolean;
    validate?: (value: number | number[], allValues: any) => string | undefined;
    validateAsync?: (value: number | number[], allValues: any) => Promise<string | undefined>;
    disabled?: boolean;
    helperText?: string; 
    placeholder?: string;   
}

export function SelectIdFieldInput<TOption>({label, fieldName, multiple, isFetching, options, getOptionValue, getOptionLabel, require, validate, validateAsync, disabled, helperText = ' ', placeholder}: SelectIdFieldInputProps<TOption>) {
    let fieldValidatorBuilder = require ? validator<number | number[]>().require() : validator<number | number[]>();

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);
    
    return (
        <Field<number | number[]> name={fieldName} validate={fieldValidator}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => {             
                if(value && multiple && !(value instanceof Array))
                    throw new Error('Invalid value. Value must be instance of Array');

                if(value && !multiple && value instanceof Array)
                    throw new Error('Invalid value. Value must not be instance of Array');

                let selecteds = multiple 
                    ? (value && options?.filter(x => (value as number[]).some(y => getOptionValue(x) === y))) || []
                    : value && options?.find(x => getOptionValue(x) === value);

                return (
                    <FormControl fullWidth>
                        {label && <label className="info-field" htmlFor={name}>{label}{(isFetching || validating) && <CircularProgress size={12} sx={{ml: 1}}/>}</label>}
                        <Autocomplete
                            placeholder={placeholder}
                            disabled={disabled}
                            loading={isFetching}
                            size="small"
                            fullWidth
                            multiple={multiple}
                            disableCloseOnSelect={multiple}
                            options={options || []}
                            getOptionLabel={getOptionLabel}
                            isOptionEqualToValue={(a, b) => getOptionValue(a) === getOptionValue(b)}
                            value={selecteds || null}
                            onChange={(_, newValue) => {
                                onChange(newValue && (newValue instanceof Array ? newValue.map(x => getOptionValue(x)) : getOptionValue(newValue)));
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