import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import { Field } from "react-final-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { Flex, FormControl, HStack, Icon, Text, VStack } from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { validator } from "../../form/validation";
import { FormattedDateTime } from "../../formatting/FormattedDateTime";

interface DateFieldInputProps {
    label?: string;
    fieldName: string;
    require?: boolean;
    clearable?: boolean;
    min?: string;
    max?: string;
    validate?: (value: string | undefined, allValues: any) => string | undefined;
    disabled?: boolean;
    fullWidth?: boolean;
    helperText?: string;
}

export function DateFieldInput({ label, fieldName, require, clearable, min, max, validate, disabled, fullWidth, helperText = ' ' }: DateFieldInputProps) {
    let fieldValidatorBuilder = validator<string | undefined>().date();

    if (require) {
        fieldValidatorBuilder = fieldValidatorBuilder.require();
    }
    if (min !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.min(min);
    }
    if (max !== undefined) {
        fieldValidatorBuilder = fieldValidatorBuilder.max(max);
    }

    const fieldValidator = fieldValidatorBuilder.build(validate);

    return (
        <Field<any> name={fieldName} validate={fieldValidator}
            format={(value) => !value ? null : parseISO(value)}
            parse={(value) => !value || isNaN(value) ? null : formatISO(value)}
        >
            {({ input: { value, onChange, onBlur, onFocus }, meta: { error, touched } }) => (
                <VStack px={1} w={fullWidth ? ["100%"] : ["100%", "100%", "50%"]}>
                   <FormControl isInvalid={Boolean(touched && error)}>
                       {label && <FormControl.Label>{label}</FormControl.Label>}
                       <DateTimePicker 
                            mode="date"
                            invalid={Boolean(touched && error)}
                            disabled={disabled}
                            clearable={clearable}
                            value={value}
                            onChange={date => onChange(date)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                        />
                        {
                            touched && error
                                ? <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
                                : <FormControl.HelperText>{helperText}</FormControl.HelperText>
                        }
                   </FormControl>
               </VStack>                                       
            )}
        </Field>
    );
}

interface DateTimePickerProps
{
    value?: Date;
    mode: "date" | "time" | "datetime";
    invalid?: boolean;
    disabled?: boolean; 
    clearable?: boolean;
    onChange:(dateTime: Date | undefined) => void;  
    onFocus?: () => void;    
    onBlur?: () => void;
}

function DateTimePicker({ value, mode, onChange, invalid, disabled, clearable, onFocus, onBlur}: DateTimePickerProps) {
    const [showPicker, setShowPicker] = useState(false);    
    return (
        <>
            <DateTimePickerModal
                isVisible={showPicker}
                mode={mode}
                date={value || new Date()}
                locale="en-US"
                onConfirm={date => {
                    setShowPicker(false);
                    onChange(date);
                    onBlur && onBlur();
                }}
                onCancel={() => setShowPicker(false)} />
            <TouchableOpacity onPress={() => {
                if(!disabled) {
                    onFocus && onFocus();
                    setShowPicker(true);
                }
            }}>
                <Flex
                    justify="space-between" direction='row'
                    borderWidth="1" borderColor={invalid ? "#ff5252" : "#d4d4d4"}
                    align="center" style={{ minHeight: Platform.OS === "android" ? 53 : 46 }} px={3} rounded="md"
                    bg={disabled ? '#e5e5e5' : 'white'}>
                    {mode !== "time" && value && <Text><FormattedDateTime variant="date" value={value} format="short" /></Text>}
                    {mode !== "date" && value && <Text><FormattedDateTime variant="time" value={value} format="short" /></Text>}
                    {!value && <Text>{' '}</Text>}
                    {clearable
                        ? <HStack>
                            <TouchableOpacity onPress={() => {
                                if (!disabled) {
                                    onFocus && onFocus();
                                    onChange(undefined);
                                    onBlur && onBlur();
                                }
                            }} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                <Icon name="close-outline" as={Ionicons} mt={1} mr={3} size={4} />
                            </TouchableOpacity>
                            {mode == "time"
                                ? <Icon color="#6c757d" name="time-outline" as={Ionicons} size={6} />
                                : <Icon color="#6c757d" name="calendar-month-outline" as={MaterialCommunityIcons} size={6} />}
                        </HStack>
                        : (mode == "time"
                            ? <Icon color="#6c757d" name="time-outline" as={Ionicons} size={6} />
                            : <Icon color="#6c757d" name="calendar-month-outline" as={MaterialCommunityIcons} size={6} />)}
                </Flex>
            </TouchableOpacity>
        </>
    );
}