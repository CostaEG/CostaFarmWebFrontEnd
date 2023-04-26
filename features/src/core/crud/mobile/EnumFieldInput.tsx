import { Field } from "react-final-form";
import { Text, Box, VStack, Radio } from "native-base";
import { validator } from "../../form/validation";

interface EnumFieldInputProps {
    label?: string;
    fieldName: string;
    options: { value: number, label: string }[];
    require?: boolean;
    validate?: (value: number | undefined, allValues: any) => string | undefined;
    disabled?: boolean;
    fullWidth?: boolean;
}

export function EnumFieldInput({ label, fieldName, options, require, validate, disabled, fullWidth }: EnumFieldInputProps) {
    const fieldValidator = require ? validator<number | undefined>().require().build(validate) : validate;

    return (
        <Field<any> name={fieldName} validate={fieldValidator} parse={value => parseInt(value)}>
            {({ input: { name, value, onChange, onBlur, onFocus }, meta: { touched, error } }) => (
                <VStack px={1} pb={4} w={fullWidth ? ["100%", "100%", "50%"] : ["100%"]}>
                    {
                        label && 
                        <Box borderBottomWidth={1} borderBottomColor="#e5e5e5" pb={1} mb={1}>
                            <Text fontSize="md">{label}</Text>
                        </Box>
                    }
                    <Radio.Group name={name} value={`${value}`} onChange={(value) => onChange(value)} onTouchStart={() => onFocus()} onTouchEnd={() => onBlur()}>
                        {options.map(x => (
                            <Radio key={x.value} isDisabled={disabled} value={x.value.toString()} mt={2}>
                                {x.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                    <Text fontSize="sm" color="#ef5350">{(touched && error) || ' '}</Text>
                </VStack>
            )}
        </Field>
    );
}