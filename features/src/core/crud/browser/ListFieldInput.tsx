import { FormControl, FormHelperText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Field } from "react-final-form";
import { validator } from "../../form/validation";
import { FieldArray } from "react-final-form-arrays";

interface ListFieldInputProps<TValue> {
    fieldName: string;
    columns: {
        title: string,
        render: (name: string, index: number, disabled?: boolean) => JSX.Element,
        width?: string
    }[];
    require?: boolean;
    validate?: (value: TValue[], allValues: any) => string | undefined;
    disabled?: boolean;
    emptyText?: string;
}

export function ListFieldInput<TValue>({ fieldName, columns, require, validate, disabled, emptyText }: ListFieldInputProps<TValue>) {
    const fieldValidator = require ? validator<TValue[]>().require().must(x => x.length === 0 ? 'Required' : undefined).build(validate) : validate;

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column, i) => (
                                <TableCell key={i} variant="head" sx={{ width: column.width, bgcolor: 'white' }}>
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <FieldArray<TValue[]> name={fieldName} >
                            {({ fields }) => {
                                if(fields.length === 0)
                                    return (
                                        <TableRow key={fieldName}>
                                            <TableCell colSpan={columns.length} sx={{border: 0}}>
                                                <Typography fontStyle={"italic"}>
                                                    {emptyText || 'No results found'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );

                                return (
                                    <>
                                        {fields.map((name, index) => (
                                            <TableRow key={name}>
                                                {columns.map((column, i) => (
                                                    <TableCell key={i} sx={{ width: column.width }}>
                                                        {column.render(name, index, disabled)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>                                    
                                        ))}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </TableBody>
                </Table>
            </TableContainer>        
            <Field<TValue[]> name={fieldName} validate={fieldValidator}>
                {({ meta: { error, touched } }) => (
                    <FormControl fullWidth>
                        {
                            Boolean(touched && typeof error === "string") &&
                            <FormHelperText error={true}>{error}</FormHelperText>
                        }
                    </FormControl>
                )}
            </Field>
        </>
    );
}