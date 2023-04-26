import { Flex, VStack, Text, HStack } from "native-base";

interface ListFieldOutputProps<TModel> {
    label: string;
    values: TModel[] | undefined;
    columns: {
        variant: "title" | "column" | "custom",
        title?: string,
        icon?: () => JSX.Element,
        getter: (value: TModel, index: number) => string | JSX.Element,
        helperText?: (value: TModel) => string
        fullWidth?: boolean;
    }[];
    emptyText?: string;
}

export default function ListFieldOutput<T>({ label, values, columns, emptyText }: ListFieldOutputProps<T>) {
    return (
        <Flex w="100%" bg="white" rounded="md" my={2} p={2}>
            <VStack pl={1} pb={1} w="100%">
                <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>
            </VStack>
            {values && values.map((x, i) => (
                <VStack key={i} p={1} pb={3} w="100%">
                    <Flex w="100%" p={1} direction="row" wrap="wrap" borderWidth="1" borderColor="#d4d4d4" rounded="md">
                        {columns.map((column, i) => {
                            if(column.variant === "custom")
                                return column.getter(x, i);

                            if(column.variant === "title")
                                return (
                                    <HStack key={i} py={1} px={1} w="100%">
                                        {column.icon && column.icon()}
                                        <Text fontSize="lg">{column.getter(x, i)}</Text>
                                    </HStack>
                                );    

                            return (
                                <VStack key={i} p={1} w={column.fullWidth ? "100%" : ["100%", "100%", "50%"]}>
                                    <Text mb={1} fontSize="sm" bold={true} color="#737373">{column.title}</Text>
                                    <Text fontSize="md">{column.getter(x, i)}</Text>
                                    {
                                        column.helperText &&
                                        <Text fontSize="sm" italic={true}>
                                            {column.helperText(x)}
                                        </Text>
                                    }
                                </VStack>
                            );
                        })}
                    </Flex>
                </VStack>))}
            {(!values || values.length == 0) && <Text pl={1} pb={1} fontSize="md" italic={true}>{emptyText || 'No results found'}</Text>}
        </Flex>
    );
}