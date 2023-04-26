import { useState } from "react";
import { Modal, StyleSheet, View } from 'react-native';
import { Alert, Box, Button, Checkbox, Flex, Text } from 'native-base';

interface ConfirmationModalProps {
    message: string;
    acknowledgeMessage?: string;
    yes: () => void;
    no: () => void;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    content: {
        width: '95%',
        maxWidth: 450,
        borderColor: '#ccc',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: 'white',
        elevation: 20,
        padding: 15,
        borderRadius: 4,
    }
});

export function ConfirmationModal({ message, acknowledgeMessage, yes, no }: ConfirmationModalProps) {
    const acknowledgeRequired = Boolean(acknowledgeMessage);
    const [acknowledge, setAcknowledge] = useState(!acknowledgeRequired);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={no}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text fontSize="lg" my={5}>{message}</Text>
                    {
                        acknowledgeRequired && <Box>
                            <Alert status="warning" mt={2} mb={3}>
                                <Checkbox my={2}
                                    isChecked={acknowledge}
                                    value="val"
                                    onChange={() => setAcknowledge(!acknowledge)}
                                >
                                    <Text m={2} fontSize="md">{acknowledgeMessage}</Text>
                                </Checkbox>
                            </Alert>
                        </Box>
                    }
                    <Flex w="100%" h={60} direction="row" justify="center" my={2}>
                        <Button size="lg" colorScheme="danger" mr={3} px={6} onPress={no}>
                            <Text color="white" fontSize="lg">No</Text>
                        </Button>    
                        <Button size="lg" colorScheme="success" ml={3} px={5} isDisabled={!acknowledge} onPress={yes}>
                            <Text color="white" fontSize="lg">Yes</Text>
                        </Button>                                            
                    </Flex>
                    <View />
                </View>
            </View>
        </Modal>
    );
}
