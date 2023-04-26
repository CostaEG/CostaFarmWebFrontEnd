import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import React, {  } from "react";
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Box, LinearProgress, useTheme, useMediaQuery } from "@mui/material";
import { Filter } from '../../models';

const components: TableComponents<any> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (<TableContainer {...props} ref={ref} />)),
    Table: (props) => (<Table {...props} sx={{ tableLayout: 'fixed' }} />),
    TableHead,
    TableRow: ({ item, ...props }) => <TableRow hover={true} {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (<TableBody {...props} ref={ref} />))
};

interface VitualListProps<TModel, TFilter extends Filter = Filter> {
    isFetching?: boolean;
    values: TModel[];
    columns: { title: string, getter: (value: TModel) => string | JSX.Element, width?: string, compactWidth?: string}[];
    filter?: TFilter;    
    onPatchFilter?: (filter: Partial<TFilter>) => void;
    isSelected?: (item: TModel) => boolean;
    onSelect?: (item: TModel) => void;
    isArchived?: (item: TModel) => boolean;
}

export default function VitualList<T>({ isFetching, values, columns, filter, onPatchFilter, isSelected, onSelect, isArchived } : VitualListProps<T>) {
    const theme = useTheme();
  	const lgDown = useMediaQuery(theme.breakpoints.down('lg'));
    
    return (
        <TableVirtuoso
            data={values}
            endReached={() => {
                if(filter && onPatchFilter) {
                    const skip = filter.skip + filter.top;
                    if (!isFetching && skip === values.length)
                        onPatchFilter({ skip });
                }
            }}
            components={components}
            fixedHeaderContent={() => (
                <TableRow>
                    {columns.filter(column => !lgDown || column.compactWidth !== "0").map((column, i) => (
                        <TableCell key={i} variant="head" sx={{ width: (lgDown && column.compactWidth) || column.width, bgcolor: 'white' }}>
                            {column.title}
                            { 
                                i=== 0 &&
                                <Box sx={{ position: 'absolute', top: '-2px', left: 0, width: '100%', display: isFetching && filter?.skip === 0 ? 'block' : 'none' }}>
                                    <LinearProgress />
                                </Box>
                            }
                        </TableCell>
                    ))}
                </TableRow>
            )}
            fixedFooterContent={() => (
                <tr>
                    <td>
                        <Box sx={{ position: 'absolute', top: '-2px', left: 0, width: '100%', display: isFetching && filter?.skip !== 0 ? 'block' : 'none' }}>
                            <LinearProgress />
                        </Box>
                    </td>
                </tr>
            )}
            itemContent={(_, item) => (
                <>
                    {columns.filter(column => !lgDown || column.compactWidth !== "0").map((column, i) => (
                        <TableCell key={i} sx={{ 
                            width: (lgDown && column.compactWidth) || column.width, 
                            bgcolor: isSelected && isSelected(item) ? "#d3e3fd" : (isArchived && isArchived(item) ? "#ffedd5" : undefined),
                            color: isSelected && isSelected(item) && isArchived && isArchived(item) ? '#c08527' : undefined
                        }} onClick={() => onSelect && onSelect(item)}>
                            {column.getter(item)}
                        </TableCell>
                    ))}
                </>
            )}
        />
    );
}
