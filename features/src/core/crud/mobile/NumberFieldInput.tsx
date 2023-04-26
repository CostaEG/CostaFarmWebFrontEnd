import { Field } from "react-final-form";
import { Flex, FormControl, Input, VStack, Text, Spinner } from "native-base";
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
    fullWidth?: boolean;
    helperText?: string;
    placeholder?: string;
}

export function NumberFieldInput({variant, label, fieldName, min, max, validate, validateAsync, unit, unitPosition, disabled, fullWidth, helperText = ' ', placeholder}: NumberFieldInputProps) {
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
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched, validating } }) => (
                <VStack px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
                    <FormControl isInvalid={Boolean(touched && error)}>
                        {label && <FormControl.Label>{label}{validating && <Spinner size="sm" ml={1}/>}</FormControl.Label>}
                        <Input p="3"       
                            keyboardType="numeric"    
                            placeholder={placeholder}                     
                            isDisabled={disabled} 
                            value={`${value}`} 
                            onFocus={() => onFocus()}
                            onBlur={() => onBlur()}
                            onChangeText={value => {
                                const valid = variant === "integer" ? integerChecker(value) : floatChecker(value);
                                if(valid)
                                    onChange(value)
                            }}
                            InputLeftElement={
                                unit && unitPosition === "start"
                                    ?   <Flex borderRightWidth={2} h="9" px={1} borderColor="#e5e5e5" minWidth={10} align="center" justify="center">
                                            <Text fontSize="sm">{unit}</Text>              
                                        </Flex>
                                    :   undefined
                            }
                            InputRightElement={
                                unit && unitPosition !== "start" 
                                    ?   <Flex borderLeftWidth={2} h="9" px={1} borderColor="#e5e5e5" minWidth={10} align="center" justify="center">
                                            <Text fontSize="sm">{unit}</Text>              
                                        </Flex>
                                    :   undefined
                            }
                        />
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