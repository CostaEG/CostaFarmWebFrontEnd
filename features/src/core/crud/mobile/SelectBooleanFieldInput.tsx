import { Field } from "react-final-form";
import { FormControl, VStack } from "native-base";
import SelectComponent from "./SelectComponent";

interface SelectBooleanFieldInputProps {
    label?: string;    
    fieldName: string;
    validate?: (value: boolean | undefined, allValues: any) => string | undefined;disabled?: boolean;
    fullWidth?: boolean;    
    helperText?: string;
    placeholder?: string;
}

const options = [1, 0];

export function SelectBooleanFieldInput({label, fieldName, validate, disabled, fullWidth, helperText = ' ', placeholder}: SelectBooleanFieldInputProps) {
    
    return (
        <Field<boolean | undefined> name={fieldName} validate={validate}>
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => {             
                
                return (
                    <VStack px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
                        <FormControl isInvalid={Boolean(touched && error)}>
                            {label && <FormControl.Label>{label}</FormControl.Label>}
                            <SelectComponent 
                                isInvalid={Boolean(touched && error)}
                                isDisabled={disabled}
                                title={label}
                                clearable={true}
                                placeholder={placeholder}
                                data={options}
                                getId={val => val}
                                getDescription={val => val === 1 ? 'Yes' : 'No'}
                                selected={value === true ? 1 : (value === false ? 0 : undefined)}
                                onSelected={selected => onChange(selected === 1 ? true : (selected === 0 ? false : null))}
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