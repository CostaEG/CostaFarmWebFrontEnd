import { useEffect, useState } from "react";
import { TextField, Box, Tooltip, IconButton, GridProps } from "@mui/material";
import { FilterListOutlined, AddOutlined } from "@mui/icons-material";
import { useMatch, useNavigate } from "react-router-dom";
import { QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Filter, Entity } from "../../models";
import { useAppDispatch, useAppSelector, useDebounce } from "../../hooks";
import { toNumericId } from "../../utils";
import { GridHS } from "../../layout/browser/Grid";
import { Panel } from "../../layout/browser/Panel";
import Loading from "../../layout/browser/Loading";
import { FloatingButtons } from "../../layout/browser/FloatingButtons";
import VirtualList from "../../layout/browser/VirtualList";
 
interface CrudListProps<TModel extends Entity, TFilter extends Filter> extends GridProps {
    path: string;
    listEndpoint: QueryHooks<QueryDefinition<TFilter | undefined, any, any, TModel[], any>>;
    listColumns: { title: string, getter: (value: TModel) => string | JSX.Element, width?: string, compactWidth?: string }[];
    selectFilter: (state: any) => TFilter;
    patchFilterActionCreator: ActionCreatorWithPayload<Partial<Filter>>;
    FilterFormComponent: (props: { onClose: () => void }) => JSX.Element;
    hideAddButton?: boolean;
}

export default function CrudList<TModel extends Entity, TFilter extends Filter>({
    path, listEndpoint, listColumns,
    selectFilter, patchFilterActionCreator, FilterFormComponent,
    hideAddButton, ...gridProps
}: CrudListProps<TModel, TFilter>
) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectFilter);
    const debouncedFilter = useDebounce(filter);

    const { isFetching, data } = listEndpoint.useQuery(debouncedFilter, { refetchOnMountOrArgChange: false });

    useEffect(() => {
        dispatch(patchFilterActionCreator({ skip: 0 }));
    }, [dispatch, patchFilterActionCreator]);

    const match = useMatch({ path: `${path}/:id/*` });
    const selectedId = toNumericId(match?.params?.id);
    const onSelect = (id: number) => navigate(`${path}${id === selectedId ? '' : `/${id}`}`)

    const [showFilter, setShowFilter] = useState(false);

    if (showFilter)
        return (
            <FilterFormComponent onClose={() => setShowFilter(false)} {...gridProps} />
        );

    return (
        <Panel {...gridProps}>
            <GridHS container sx={{ p: 1, borderBottom: "1px solid rgba(224, 224, 224, 1);" }}>
                <GridHS xs>
                    <TextField size="small" placeholder="Search" autoComplete="off" fullWidth
                        value={filter.search} onChange={({ target: { value } }) => {
                            dispatch(patchFilterActionCreator({ search: value, skip: 0 }));
                        }} />
                </GridHS>
                <GridHS>
                    <Tooltip title="Filter list">
                        <IconButton sx={{ ml: 1 }} onClick={() => setShowFilter(true)}>
                            <FilterListOutlined />
                        </IconButton>
                    </Tooltip>
                </GridHS>
            </GridHS>
            <Box sx={{ height: "calc(100% - 57px)" }}>
                {
                    !data && <Loading />
                }
                {
                    data &&
                    <>
                        <VirtualList
                            isFetching={isFetching}
                            values={data}
                            columns={listColumns}
                            filter={filter}
                            onPatchFilter={patch => dispatch(patchFilterActionCreator(patch))}
                            isSelected={item => item.id === selectedId}
                            onSelect={item => onSelect(item.id)}
                            isArchived={item => Boolean(item.archivedBy)}
                        />
                        {!hideAddButton && <FloatingButtons actions={[
                            {
                                title: "Add",
                                color: "success",
                                icon: <AddOutlined />,
                                onClick: () => navigate(`${path}/form`)
                            }
                        ]} />}
                    </>
                }
            </Box>
        </Panel>
    );
}
