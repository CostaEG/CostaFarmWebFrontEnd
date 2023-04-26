import { Field } from "react-final-form";
import { Checkbox, VStack, Text, Switch } from "native-base";
import { validator } from "../../form/validation";

interface BooleanFieldInputProps {
    variant?: "checkbox" | "switch";
    label: string;
    fieldName: string;
    require?: boolean;
    validate?: (value: boolean, allValues: any) => string | undefined;
    disabled?: boolean;
    fullWidth?: boolean;
}

export function BooleanFieldInput({ variant, label, fieldName, require, validate, disabled, fullWidth }: BooleanFieldInputProps) {
    const fieldValidator = require ? validator<boolean>().require().build(validate) : validate;

    if (variant === "switch") {
        return (
            <Field<boolean> name={fieldName} validate={fieldValidator}>
                {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                    <VStack px={1} pb={4} w={fullWidth ? ["100%", "100%", "50%"] : ["100%"]}>
                        <Switch 
                            isDisabled={disabled}
                            isChecked={value}
                            onChange={() => onChange(!value)}
                            onTouchStart={() => onFocus()}
                            onTouchEnd={() => onBlur()}
                            isInvalid={!!error}>
                            <Text m={2} fontSize="md">{label}</Text>
                        </Switch>
                        {touched && error && <Text color="#ef5350" fontSize="sm">{error}</Text>}
                    </VStack>
                )}
            </Field>
        );
    }

    return (
        <Field<boolean> name={fieldName} validate={fieldValidator}>
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                <VStack px={1} pb={4} w={fullWidth ? ["100%", "100%", "50%"] : ["100%"]}>
                    <Checkbox 
                        isDisabled={disabled}
                        value="val"
                        isChecked={value}
                        onChange={() => onChange(!value)}
                        onTouchStart={() => onFocus()}
                        onTouchEnd={() => onBlur()}
                        isInvalid={!!error}>
                        <Text m={2} fontSize="md">{label}</Text>
                    </Checkbox>
                    {touched && error && <Text color="#ef5350" fontSize="sm">{error}</Text>}
                </VStack>
            )}
        </Field>
    );
}
/*
<FormControl fullWidth>
                    <FormControlLabel disabled={disabled} control={<Checkbox name={name} value={value} checked={checked} onChange={onChange} onBlur={onBlur} onFocus={onFocus}/>} label={label} />  
                    <FormHelperText error={Boolean(touched && error)}>{touched && error ? error : ' '}</FormHelperText>
                    {/*touched && error && <FormHelperText error={true}>{error}</FormHelperText>*}
                    </FormControl>
*/