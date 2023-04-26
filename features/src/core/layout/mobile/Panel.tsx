import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Flex, Icon, IconButton, Text } from "native-base";
import { ReactNode, useEffect } from "react";
import { BackHandler, View } from "react-native";
import { useNavigate } from "react-router-native";

export function Panel({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            navigate(-1)
            return true;
        });

        return () => subscription.remove();
    }, []);

    return (
        <Flex h="100%">
            {children}
        </Flex>
    )
}

interface PanelHeaderProps {
    title: string;
    renderRightButton?: () => JSX.Element
}

export function PanelHeader({ title, renderRightButton }: PanelHeaderProps) {
    const navigate = useNavigate();

    return (
        <View style={{
            height: 60,
            backgroundColor: 'white',
            borderBottomWidth: 2,
            borderBottomColor: '#e5e5e5',
        }}>
            <Flex flex={1} direction="row" justify="space-between" align="center">
                <IconButton
                    accessibilityLabel="Navigate back"
                    onPress={() => navigate(-1)}
                    icon={<Icon name="arrow-back" as={Ionicons} size={8} color="#0ea5e9" />}
                />
                <Text fontWeight="bold" fontSize="lg">
                    {title}
                </Text>
                {
                    renderRightButton
                        ? renderRightButton()
                        : <IconButton
                            onPress={() => navigate("/", { replace: true })}
                            icon={<Icon name="home" as={MaterialIcons} size={8} color="#0ea5e9" />}
                        />
                }
            </Flex>
        </View>
    );
}