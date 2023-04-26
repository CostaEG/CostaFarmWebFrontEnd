import { VStack, Text } from "native-base";
import { FormattedDateTime } from "../../formatting/FormattedDateTime";

interface DateTimeFieldOutputProps {
    label: string;
    value: Date | string | undefined;
    variant: "date" | "time" | "datetime" | "custom";
    format?: "short" | "long";
    customFormat?: string;
    fullWidth?: boolean;
}

export function DateTimeFieldOutput({ value, label, variant, format, customFormat, fullWidth }: DateTimeFieldOutputProps) {
    return (
        <VStack py={2} px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
            <VStack pl={2} py={3} bg="white" rounded="md">
                <Text fontSize="sm" fontWeight={500} color="rgba(115,115,115,1.00)" mb={1}>{label}</Text>                
                <Text fontSize="md">
                    {
                        value === undefined
                            ? '-'
                            : <FormattedDateTime value={value} variant={variant} format={format} customFormat={customFormat} />
                    }
                </Text>
            </VStack>
        </VStack>
    );
}