import { Checkbox, FormControl, FormControlLabel, FormHelperText, Switch } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface BooleanFieldInputProps {
    variant?: "checkbox" | "switch";
    label: string;
    fieldName: string;
    require?: boolean;
    validate?: (value: boolean, allValues: any) => string | undefined;
    disabled?: boolean;
}

export function BooleanFieldInput({ variant, label, fieldName, require, validate, disabled }: BooleanFieldInputProps) {
    const fieldValidator = require ? validator<boolean>().require().build(validate) : validate;

    if (variant === "switch") {
        return (
            <Field<boolean> name={fieldName} type="checkbox" validate={fieldValidator}>
                {({ input: { name, checked, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                    <FormControl fullWidth>
                        <FormControlLabel disabled={disabled} control={<Switch name={name} checked={checked} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />} label={label} />
                        <FormHelperText error={Boolean(touched && error)}>{touched && error ? error : ' '}</FormHelperText>
                        {/*touched && error && <FormHelperText error={true}>{error}</FormHelperText>*/}
                    </FormControl>
                )}
            </Field>
        );
    }

    return (
        <Field<boolean> name={fieldName} type="checkbox" validate={fieldValidator}>
            {({ input: { name, value, checked, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                <FormControl fullWidth>
                    <FormControlLabel disabled={disabled} control={<Checkbox name={name} value={value} checked={checked} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />} label={label} />
                    <FormHelperText error={Boolean(touched && error)}>{touched && error ? error : ' '}</FormHelperText>
                    {/*touched && error && <FormHelperText error={true}>{error}</FormHelperText>*/}
                </FormControl>
            )}
        </Field>
    );
}