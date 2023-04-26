import { Alert, CloseIcon, HStack, IconButton, Stack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from 'react-native';

interface ErrorNotificationProps {
    errorMessage: string | string[];
    onClosed?: () => void;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
});

export function ErrorNotification({ errorMessage, onClosed }: ErrorNotificationProps) {
    const [open, setOpen] = useState(Boolean(errorMessage));

    const onClose = () => {
        setOpen(false);
        onClosed && onClosed();        
    };

    useEffect(() => {
        setOpen(Boolean(errorMessage));
    }, [errorMessage])

    if (!open)
        return null;

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Stack space={3} w="100%" maxW="400">
                    <Alert w="100%" status="error">
                        <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} justifyContent="space-between">
                            <HStack space={2} flexShrink={1} flexWrap="wrap">
                                <Alert.Icon mt="1" />
                                {
                                    errorMessage instanceof Array
                                        ?   <VStack>
                                                {errorMessage.map((x, i) => <Text fontSize="md" key={i}>{x}</Text>)}
                                            </VStack>
                                        :   <Text fontSize="md">{errorMessage}</Text>
                                }
                            </HStack>
                            <IconButton 
                                variant="unstyled" 
                                icon={<CloseIcon size="4" />}
                                onPress={onClose}
                            />
                        </HStack>
                        </VStack>
                    </Alert>
                </Stack>
            </View>
        </Modal>
    );
}