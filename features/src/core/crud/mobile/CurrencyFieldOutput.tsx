import { VStack, Text } from "native-base";
import { FormattedCurrency } from "../../formatting/FormattedCurrency";

interface CurrencyFieldOutputProps {
    label: string;
    value: number | undefined;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    fullWidth?: boolean;
}

export function CurrencyFieldOutput({ value, label, minimumFractionDigits, maximumFractionDigits, fullWidth }: CurrencyFieldOutputProps) {
    return (
        <VStack py={2} px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
            <VStack pl={2} py={3} bg="white" rounded="md">
                <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>                
                <Text fontSize="md">
                    {
                        value === undefined
                            ? '-'
                            : <FormattedCurrency value={value} minimumFractionDigits={minimumFractionDigits} maximumFractionDigits={maximumFractionDigits} />
                    }
                </Text>
            </VStack>
        </VStack>
    );
}