import { VStack, Text } from "native-base";

interface StringFieldOutputProps {
    label: string;
    value: string | undefined;
    fullWidth?: boolean;
}

export function StringFieldOutput({ value, label, fullWidth }: StringFieldOutputProps){
    return (
        <VStack py={2} px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
            <VStack pl={2} py={3} bg="white" rounded="md">
                <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>
                <Text fontSize="md">{value || '-'}</Text>
            </VStack> 
        </VStack>
    );
}