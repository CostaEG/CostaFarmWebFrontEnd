import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography } from "@mui/material";

interface ListFieldOutputProps<TModel> {
    values: TModel[];
    columns: { 
        title: string, 
        getter: (value: TModel) => string | JSX.Element, 
        width?: string 
    }[];
    emptyText?: string;
}

export default function ListFieldOutput<T>({ values, columns, emptyText }: ListFieldOutputProps<T>) {
    return (
        <TableContainer>
            <Table>
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
                    {values.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column, i) => (
                                <TableCell key={i} sx={{ width: column.width }}>
                                    {column.getter(item)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {
                        values.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={columns.length} sx={{border: 0}}>
                                <Typography fontStyle={"italic"}>
                                    {emptyText || 'No results found'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
