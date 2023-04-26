import { useAppDispatch, useAppSelector, useDebounce } from "../../hooks";
import { QueryHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { Filter, Entity } from "../../models";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useNavigate, useSearchParams } from "react-router-native";
import { Box, Flex, Icon, Input } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Panel, PanelHeader } from "../../layout/mobile/Panel";
import Loading from "../../layout/mobile/Loading";
import VirtualList from "../../layout/mobile/VirtualList";
import { FloatingButtons } from "../../layout/mobile/FloatingButtons";

interface CrudListProps<TModel extends Entity, TFilter extends Filter> {
    title: string,
    path: string;
    listEndpoint: QueryHooks<QueryDefinition<TFilter | undefined, any, any, TModel[], any>>;
    columns: {
        variant: "row" | "title" | "column" | "custom",
        title?: string,
        icon?: () => JSX.Element,
        getter: (value: TModel) => string | JSX.Element,
        helperText?: (value: TModel) => string,
        fullWidth?: boolean
    }[];
    rowHeight?: number;
    initialNumToRender?: number;
    selectFilter: (state: any) => TFilter;
    patchFilterActionCreator: ActionCreatorWithPayload<Partial<Filter>>;
    hideAddButton?: boolean;
}

export default function CrudList<TModel extends Entity, TFilter extends Filter>({
    title, path, listEndpoint,
    columns, rowHeight, initialNumToRender,
    selectFilter, patchFilterActionCreator,
    hideAddButton
}: CrudListProps<TModel, TFilter>
) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectFilter);
    const debouncedFilter = useDebounce(filter);

    const { isFetching, data } = listEndpoint.useQuery(debouncedFilter, { refetchOnMountOrArgChange: false });

    const [scrollIndex, setScrollIndex] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const savedScrollIndex = parseInt(searchParams.get("scrollIndex") ?? "-1");

    useEffect(() => {
        if (savedScrollIndex === -1) {
            dispatch(patchFilterActionCreator({ skip: 0 }));
        } else {
            setScrollIndex(savedScrollIndex);
        }
    }, [savedScrollIndex, dispatch, patchFilterActionCreator]);

    const onSelect = (id: number, index: number) => {
        setSearchParams({ scrollIndex: index.toString() }, { replace: true });
        navigate(`${path}/${id}`);
    };

    return (
        <Panel>
            <PanelHeader title={title} renderRightButton={() => (
                <TouchableOpacity onPress={() => navigate(`${path}/filter`)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Icon mx="2" name="filter" as={Ionicons} color={'#0ea5e9'} size={7} />
                </TouchableOpacity>
            )} />
            <Flex flex={1}>
                <Box w="100%" p="2" borderBottomWidth={1} borderBottomColor="#e5e5e5">
                    <Input placeholder="Search" value={filter.search} onChangeText={value => dispatch(patchFilterActionCreator({ search: value, skip: 0 }))} />
                </Box>
                {
                    !data && <Loading />
                }
                {
                    data &&
                    <>
                        <VirtualList<TModel>
                            isFetching={isFetching}
                            values={data}
                            columns={columns}
                            rowHeight={rowHeight}
                            initialNumToRender={initialNumToRender}
                            initialScrollIndex={scrollIndex >= 0 && scrollIndex < data.length ? scrollIndex : 0}
                            filter={filter}
                            onPatchFilter={patch => dispatch(patchFilterActionCreator(patch))}
                            onSelect={(item, index) => onSelect(item.id, index)}
                        />
                        {!hideAddButton && <FloatingButtons actions={[
                            {
                                title: "Add",
                                color: "#4caf50",
                                icon: <Icon name="add" as={Ionicons} color="white" size={8} />,
                                onClick: () => navigate(`${path}/form`)
                            }
                        ]} />}
                    </>
                }
            </Flex>
        </Panel>
    );
}
