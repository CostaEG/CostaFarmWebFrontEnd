import { Field } from "react-final-form";
import { validator } from "../../form/validation";
import { FieldArray } from "react-final-form-arrays";
import { Flex, VStack, Text } from "native-base";
import { Fragment } from "react";

interface ListFieldInputProps<TValue> {
    label: string;
    fieldName: string;
    columns: {
        render: (name: string, index: number, disabled?: boolean) => JSX.Element
    }[];
    require?: boolean;
    validate?: (value: TValue[], allValues: any) => string | undefined;
    disabled?: boolean;
    emptyText?: string;
}

export function ListFieldInput<TValue>({ label, fieldName, columns, require, validate, disabled, emptyText }: ListFieldInputProps<TValue>) {
    const fieldValidator = require ? validator<TValue[]>().require().must(x => x.length === 0 ? 'Required' : undefined).build(validate) : validate;

    return (
        <>
            <Flex w="100%" bg="white" rounded="md" my={2}>
                <VStack pl={1} pb={1} w="100%">
                    <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>
                </VStack>
                <FieldArray<TValue[]> name={fieldName} >
                    {({ fields }) => {
                        if(fields.length === 0)
                            return (
                                <Text key={fieldName} pl={1} pb={1} fontSize="md" italic={true}>{ emptyText || 'No results found'}</Text>
                            );

                        return (
                            <>
                                {fields.map((name, index) => (
                                    <VStack key={name} p={1} pb={3} w="100%">
                                        <Flex w="100%" p={1} direction="row" wrap="wrap" borderWidth="1" borderColor="#d4d4d4" rounded="md">
                                            {columns.map((column, i) => (
                                                <Fragment key={`${name}_${i}`}>
                                                    {column.render(name, index, disabled)}
                                                </Fragment>
                                            ))}
                                        </Flex>
                                    </VStack>                                 
                                ))}
                            </>
                        );
                    }}
                </FieldArray>
            </Flex>
            <Field<TValue[]> name={fieldName} validate={fieldValidator}>
                {({ meta: { error, touched } }) => (
                    <>
                        {
                            Boolean(touched && typeof error === "string") &&
                            <Text color="#ef5350" fontSize="sm">{error}</Text>
                        }
                    </>
                )}
            </Field>
        </>
    );
}

/*
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
*/