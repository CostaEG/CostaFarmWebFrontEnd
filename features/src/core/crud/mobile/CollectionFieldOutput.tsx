import { VStack, Text, Box } from "native-base";
import { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";

interface CollectionFieldOutputProps {
    label: string;
    value: string[] | undefined;
    maxItems?: number;
    emptyText?: string;
}

export function CollectionFieldOutput({ value, label, maxItems = 10, emptyText }: CollectionFieldOutputProps) {
    const [max, setMax] = useState(maxItems);

    var items = useMemo(() => value?.slice(0, max), [value, max]);

    return (
        <VStack py={2} px={1} w="100%">
            <VStack pl={2} py={3} bg="white" rounded="md">
                <Box borderBottomWidth={1} borderBottomColor="#e5e5e5" pb={1} mb={1}>
                    <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>                
                </Box>
                {
                    !items || items.length == 0
                        ? <Text fontSize="md" italic={true}>{ emptyText || 'No results found'}</Text>
                        : <>
                            {items.map((x, i) => <Text fontSize="md" key={i} ml={2}>{x}</Text>)}
                            {
                                items.length > max &&
                                <TouchableOpacity
                                    onPress={() => setMax(max + 15)}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                >
                                    <Text fontSize="sm" ml={2} color="#7fb432">Show More</Text>
                                </TouchableOpacity>
                            }
                        </>
                }
            </VStack>
        </VStack>
    );
}