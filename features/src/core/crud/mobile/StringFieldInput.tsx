import { Field } from "react-final-form";
import { VStack, Input, FormControl, TextArea, Spinner } from "native-base";
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
    fullWidth?: boolean;
    helperText?: string;
    placeholder?: string;
}

export function StringFieldInput({ label, fieldName, require, validate, validateAsync, disabled, multiline, rows, fullWidth, helperText = ' ', placeholder }: StringFieldInputProps) {
    let fieldValidatorBuilder = require ? validator<string>().require() : validator<string>();

    const fieldValidator = fieldValidatorBuilder.must(validate).build(validateAsync);

    return (
        <Field<string> name={fieldName} validate={fieldValidator}>
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => (
                <VStack px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
                    <FormControl isInvalid={Boolean(touched && error)}>
                        {label && <FormControl.Label>{label}{validating && <Spinner size="sm" ml={1}/>}</FormControl.Label>}
                        { 
                            multiline 
                                ?   <TextArea 
                                        placeholder={placeholder}                          
                                        numberOfLines={rows}
                                        isDisabled={disabled}
                                        value={value}
                                        onFocus={() => onFocus()}
                                        onBlur={() => onBlur()}
                                        onChangeText={value => onChange(value)} 
                                        autoCompleteType={undefined}
                                    />
                                :   <Input p="3"      
                                        placeholder={placeholder}                          
                                        isDisabled={disabled} 
                                        value={value} 
                                        onFocus={() => onFocus()}
                                        onBlur={() => onBlur()}
                                        onChangeText={value => onChange(value)}
                                    />
                        }
                        {
                            touched && error
                            ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
                            : <FormControl.HelperText>{helperText}</FormControl.HelperText>
                        }
                    </FormControl>
                </VStack>
            )}
        </Field>
    );
}