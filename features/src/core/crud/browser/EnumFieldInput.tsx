import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";

interface EnumFieldInputProps {
    label?: string;
    fieldName: string;
    options:  { value: number, label: string }[];
    require?: boolean;
    validate?: (value: number | undefined, allValues: any) => string | undefined;
    disabled?: boolean;
}

export function EnumFieldInput({label, fieldName, options, require, validate, disabled}: EnumFieldInputProps) {
    const fieldValidator = require ? validator<number | undefined>().require().build(validate) : validate;

    return (
        <Field<any> name={fieldName} validate={fieldValidator} parse={value => parseInt(value)}>
            {({ input: { name, value, onChange }, meta: { error } }) => (   
                <FormControl fullWidth>
                    {label && <label className="info-field">{label}</label>}
                    <RadioGroup row name={name} value={value} onChange={({target: {value}}) => onChange(value)}>
                        {options.map(x => (
                            <FormControlLabel key={x.value} disabled={disabled} value={x.value} label={x.label} control={<Radio/>} />
                        ))}
                    </RadioGroup>
                    <FormHelperText error={Boolean(error)}>{error || ' '}</FormHelperText>
                </FormControl>             
            )}
        </Field>
    );
}