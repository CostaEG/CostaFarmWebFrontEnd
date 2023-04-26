import { Field } from "react-final-form";
import { FormControl, Spinner, VStack } from "native-base";
import SelectComponent from "./SelectComponent";
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
    clearable?: boolean;
    validate?: (value: number | number[] | undefined, allValues: any) => string | undefined;
    validateAsync?: (value: number | number[] | undefined, allValues: any) => Promise<string | undefined>;
    disabled?: boolean;    
    fullWidth?: boolean;
    helperText?: string;
    placeholder?: string;
}

export function SelectIdFieldInput<TOption>({label, fieldName, multiple, isFetching, options, getOptionValue, getOptionLabel, require, clearable, validate, validateAsync, disabled, fullWidth, helperText = ' ', placeholder}: SelectIdFieldInputProps<TOption>) {
    let fieldValidatorBuilder = require ? validator<number | number[] | undefined>().require() : validator<number | number[] | undefined>();

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);
    
    return (
        <Field<number | number[] | undefined> name={fieldName} validate={fieldValidator}>
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => {             
                if(value && multiple && !(value instanceof Array))
                    throw new Error('Invalid value. Value must be instance of Array');

                if(value && !multiple && value instanceof Array)
                    throw new Error('Invalid value. Value must not be instance of Array');

                return (
                    <VStack px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
                        <FormControl isInvalid={Boolean(touched && error)}>
                            {label && <FormControl.Label>{label}{(isFetching || validating) && <Spinner size="sm" ml={1}/>}</FormControl.Label>}
                            <SelectComponent 
                                isInvalid={Boolean(touched && error)}
                                clearable={clearable}
                                isDisabled={disabled}
                                title={label}
                                placeholder={placeholder}
                                doNotCloseOnSelect={multiple}
                                data={options || []}
                                getId={val => getOptionValue(val)}
                                getDescription={val => getOptionLabel(val)}
                                selected={!multiple ? value as number : undefined}
                                onSelected={!multiple ? selected => onChange(selected) : undefined}
                                selecteds={multiple ? value as number[] : undefined}
                                onSelecteds={multiple ? selecteds => onChange(selecteds) : undefined}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {
                                touched && error
                                ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
                                : <FormControl.HelperText>{helperText}</FormControl.HelperText>
                            }
                        </FormControl>
                    </VStack>                                                              
                );
            }}
        </Field>
    );
}