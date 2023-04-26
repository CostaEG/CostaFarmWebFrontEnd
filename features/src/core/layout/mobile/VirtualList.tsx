import { FlatList, TouchableOpacity, View } from "react-native";
import { Center, Flex, HStack, Text, VStack } from "native-base";
import { Filter, Entity } from "../../models";

interface VitualListProps<TModel extends Entity, TFilter extends Filter = Filter> {
    isFetching?: boolean;
    values: TModel[];    
    columns: {
        variant: "row" | "title" | "column" | "custom",
        title?: string,
        icon?: () => JSX.Element,
        getter: (value: TModel, index: number) => string | JSX.Element,
        helperText?: (value: TModel) => string,
        fullWidth?: boolean
    }[];
    rowHeight?: number;
    initialNumToRender?: number;
    initialScrollIndex?: number;
    filter?: TFilter;
    onPatchFilter?: (filter: Partial<TFilter>) => void;
    onSelect?: (item: TModel, index: number) => void;
}

export default function VitualList<T extends Entity>({ isFetching, values, columns, filter, onPatchFilter, onSelect, rowHeight = 60, initialNumToRender = 18, initialScrollIndex }: VitualListProps<T>) {

    return (
        <FlatList
            initialNumToRender={initialNumToRender}
            initialScrollIndex={initialScrollIndex}
            data={values}            
            renderItem={data => (
                <TouchableOpacity key={data.item.id} onPress={() => onSelect && onSelect(data.item, data.index)}>
                    <Flex w="100%" h={rowHeight} p={1} 
                        direction="row" wrap="wrap" 
                        bg={Boolean(data.item.archivedBy) ? "#ffedd5" : "#FFF"} 
                        borderBottomWidth={1} borderBottomColor="#e5e5e5">
                        {columns.map((column, i) => {
                            if(column.variant === "custom")
                                return column.getter(data.item, i);

                            if(column.variant === "row")
                                return (
                                    <Center key={i} >
                                        <HStack px={2}>
                                            {column.icon && column.icon()}
                                            <Text fontSize="lg">{column.getter(data.item, i)}</Text>
                                        </HStack>
                                    </Center>
                                );    

                            if(column.variant === "title")
                                return (
                                    <HStack key={i} py={1} px={2} w="100%">
                                        {column.icon && column.icon()}
                                        <Text fontSize="lg">{column.getter(data.item, i)}</Text>
                                    </HStack>
                                );    

                            return (
                                <VStack key={i} py={1} px={2} w={column.fullWidth ? "100%" : "50%"}>
                                    <Text mb={1} fontSize="sm" bold={true} color="#737373">{column.title}</Text>
                                    <Text fontSize="md">{column.getter(data.item, i)}</Text>
                                    {
                                        column.helperText &&
                                        <Text fontSize="sm" italic={true}>
                                            {column.helperText(data.item)}
                                        </Text>
                                    }
                                </VStack>
                            );
                        })}
                    </Flex>
                </TouchableOpacity>
            )}
            getItemLayout={(_, index) => ({ length: rowHeight, offset: rowHeight * index, index })}
            keyExtractor={item => item.id.toString()}
            ListFooterComponent={() => <View style={{ height: 80 }} />}
            ListEmptyComponent={() => (
                <Flex p={5} align="center">
                    <Text fontSize="md" italic={true} bold={true}>No results found</Text>
                </Flex>)}
            onEndReached={() => {
                if (filter && onPatchFilter) {
                    const skip = filter.skip + filter.top;
                    if (!isFetching && skip === values.length)
                        onPatchFilter({ skip });
                }
            }}
            refreshing={isFetching}
            onRefresh={() => {
                if (filter && onPatchFilter) {
                    onPatchFilter({ skip: 0, RefreshToken: (filter.RefreshToken || 0) + 1 });
                }
            }}
        />
    );
}