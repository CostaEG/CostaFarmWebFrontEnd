import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-native";
import { Actionsheet, Box, Center, Divider, Flex, Heading, Icon, IconButton, Stack, Text } from 'native-base';
import { ScrollView, TouchableOpacity, View, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useSecurityContext } from "../../hooks";
import { manifest } from "../../manifest";
import { MainMenuCategory, MainMenuItem } from "../../menu";
import { getFilteredMenu } from "../../menu/getFilteredMenu";
import { getItemRouteInfo } from "../../menu/getRoutes";
import { logout } from "../../security/mobile/utils";

export function MainMenu() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const securityContext = useSecurityContext();
    const menu = getFilteredMenu(securityContext);
    const [selectedCategory, selectCategory] = useState<MainMenuCategory | undefined>(undefined);
    
    return (
        <>
            <ScrollView>
                <Stack space={6}>
                    <View style={{
                        height: 60,
                        backgroundColor: 'white',
                        borderBottomWidth: 2,
                        borderBottomColor: '#e5e5e5',
                    }}>
                        <Flex flex={1} direction="row" justify="space-between" align="center">
                            <Box ml={3}>
                                <Image resizeMode="contain" source={require('../../../../../assets/favicon.png')}/>
                            </Box>
                            <Text fontWeight="bold" fontSize="lg">
                                {manifest.title}
                            </Text>
                            <IconButton accessibilityLabel="Navigate back"
                                onPress={() => logout(dispatch)}
                                icon={<Icon name="logout" as={MaterialIcons} size={8} color="#0ea5e9"/>}/>
                        </Flex>
                    </View>
                    <Center my="5">
                        <Heading>Hi, {securityContext?.identity.name}</Heading>
                    </Center>
                    <Center>
                        <Stack space={0} maxWidth={[400, 500, 680]}>
                            <Flex direction="row" wrap="wrap" justify="space-around">
                                {menu.map((x, i) => (
                                    <TouchableOpacity key={i} onPress={() => {
                                        const category = x as MainMenuCategory;
                                        if(category.items) {
                                            selectCategory(category);
                                        } else {
                                            const item = x as MainMenuItem;

                                            const routeInfo = getItemRouteInfo(undefined, item);

                                            navigate(routeInfo.path);
                                        }
                                    }}>
                                        <Center my="3" mx="1" w={[185, 207, 234]} h={[120, 138, 156]} borderWidth="1" rounded="lg" borderColor="#0ea5e9">
                                            <Icon name={x?.icon} as={x?.iconFamily} size={x?.iconSize || 10} color="#0ea5e9"/>
                                            <Text color="black" mt="2" fontSize={["md", "lg"]}>{x?.title}</Text>
                                        </Center>
                                    </TouchableOpacity>
                                ))}
                            </Flex>
                        </Stack>
                    </Center>
                </Stack> 
            </ScrollView>
            <Actionsheet 
                isOpen={selectedCategory ? true : false} 
                onClose={() => selectCategory(undefined)}>
                <Actionsheet.Content>
                    {selectedCategory && selectedCategory.items.map((x, i) => (
                        <React.Fragment key={i}>
                            <Actionsheet.Item p={4} startIcon={<Icon name={x.icon} as={x.iconFamily} size={x.iconSize || 6} color="#0ea5e9"/>}
                                onPress={() => {
                                    const routeInfo = getItemRouteInfo(selectedCategory, x);
                                    
                                    navigate(routeInfo.path);
                                }}>
                                <Text color="black" fontSize="lg">{x.title}</Text>
                            </Actionsheet.Item>
                            <Divider bg="#e5e5e5"/>
                        </React.Fragment>
                    ))}                    
                    <Actionsheet.Item startIcon={<Icon name="ios-close" as={Ionicons} size={6} color="#0ea5e9"/>}
                        onPress={() => selectCategory(undefined)}>
                        <Text color="black" fontSize="lg">Cancel</Text>
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    );
}