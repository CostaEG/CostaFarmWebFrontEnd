import { VStack, Text } from "native-base";
import { FormattedNumber } from "../../formatting/FormattedNumber";

interface NumberFieldOutputProps {
    label: string;
    value: number | undefined;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    unit?: string;
    unitPosition?: "start" | "end",
    fullWidth?: boolean;
}

export function NumberFieldOutput({ value, label, minimumFractionDigits, maximumFractionDigits, unit, unitPosition, fullWidth }: NumberFieldOutputProps) {
    return (
        <VStack py={2} px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
            <VStack pl={2} py={3} bg="white" rounded="md">
                <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>                
                <Text fontSize="md">
                    {
                        value === undefined
                            ? '-'
                            : <>
                                {unit && unitPosition === "start" && `${unit} `}
                                <FormattedNumber value={value} minimumFractionDigits={minimumFractionDigits} maximumFractionDigits={maximumFractionDigits} />
                                {unit && unitPosition !== "start" && ` ${unit}`}
                            </>
                    }
                </Text>
            </VStack>
        </VStack>
    );
}