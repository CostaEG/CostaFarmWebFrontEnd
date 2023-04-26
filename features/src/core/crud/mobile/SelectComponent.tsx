import { HStack, IconButton, Icon, Text, Flex, Box, Input } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { View, FlatList, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from 'react-native-action-button-warnings-fixed';
import { safeAreaStyles } from '../../layout/mobile/SafeAreaStyles';

export interface SelectComponentProps {
    title?: string;
    placeholder?: string;
    data: any[];
    selected?: number;
    onSelected?: (selected: number | undefined) => void;
    selecteds?: number[];
    onSelecteds?: (selected: number[] | undefined) => void;
    getId: (data: any) => number;
    getDescription: (data: any) => string;
    isInvalid?: boolean;
    isDisabled?: boolean;
    clearable?: boolean;
    doNotCloseOnSelect?: boolean;
    initialNumToRender?: number;
    onFocus?: ()=> void;
    onBlur?: ()=> void;
}

export interface SelectComponentState {
    search: string;
    showModal: boolean;
}

export default class SelectComponent extends React.Component<SelectComponentProps, SelectComponentState>
{
    constructor(props: SelectComponentProps) {
        super(props);

        this.state = {
            search: '',
            showModal: false
        };
        this.renderItem = this.renderItem.bind(this);
    }

    getSelecteds() {
        var selecteds = [];

        if (this.props.selected !== null && this.props.selected !== undefined)
            selecteds.push(this.props.selected);
        if (this.props.selecteds)
            selecteds.push(...this.props.selecteds);

        return selecteds;
    }

    showModal = () => {
        if (!this.props.isDisabled)
            this.setState((s: SelectComponentState) => {                
                s.showModal = true;
                return s;
            }, this.props.onFocus);
    }

    render() {
        var selecteds = this.getSelecteds();

        var description = selecteds.map(s => {
            var item = this.props.data.find(x => this.props.getId(x) == s)
            return item === undefined || item === null ? '' : this.props.getDescription(item);
        }).join(', ');

        return (
            <>
                {this.renderModal()}
                <TouchableOpacity
                    onPress={this.showModal}>
                    <Flex
                        justify="space-between" direction='row'
                        borderWidth="1" borderColor={this.props.isInvalid ? "#ff5252" : "#d4d4d4"}
                        align="center" style={{ minHeight: Platform.OS === "android" ? 53 : 46 }} px={3} rounded="md"
                        bg={this.props.isDisabled ? '#e5e5e5' : 'white'}>
                        <Text w="85%" fontSize="md">{description || this.props.placeholder || 'Select'}</Text>
                        {this.props.clearable
                            ? <HStack>
                                <TouchableOpacity onPress={() => {
                                    if (!this.props.isDisabled) {
                                        this.props.onFocus && this.props.onFocus();
                                        if(this.props.onSelected)
                                            this.props.onSelected(undefined);
                                        else if(this.props.onSelecteds)
                                            this.props.onSelecteds(undefined);
                                        this.props.onBlur && this.props.onBlur();
                                    }
                                }} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                    <Icon name="close-outline" as={Ionicons} mt={1} mr={1} size={4} />
                                </TouchableOpacity>
                                <Icon name="arrow-drop-down" as={MaterialIcons} size={6} />
                            </HStack>
                            : <Icon name="arrow-drop-down" as={MaterialIcons} size={6} />}
                    </Flex>
                </TouchableOpacity>
            </>
        );
    }

    closeModal = () => {
        this.setState((s: SelectComponentState) => {
            s.showModal = false;
            return s;
        }, this.props.onBlur);
    };

    renderModal() {
        if (!this.state.showModal)
            return null;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={this.closeModal}>
                <SafeAreaProvider>
                    <SafeAreaView style={safeAreaStyles.container}>
                        <View style={{
                            height: 60,
                            backgroundColor: 'white',
                            borderBottomWidth: 2,
                            borderBottomColor: '#e5e5e5',
                        }}>
                            <Flex flex={1} direction="row" justify="space-between" align="center">
                                <IconButton accessibilityLabel="Navigate back"
                                    onPress={this.closeModal}
                                    icon={<Icon name="arrow-back" as={Ionicons} size={8} color="#0ea5e9" />} />
                                <Text fontWeight="bold" fontSize="lg">
                                    {this.props.title || 'Select'}
                                </Text>
                                {this.props.doNotCloseOnSelect
                                    ? <IconButton onPress={() => this.props.onSelected ? this.props.onSelected(undefined) : this.props.onSelecteds && this.props.onSelecteds(undefined)}
                                        icon={<Icon name="refresh" as={MaterialIcons} size={8} color="#f0ad4e" />} />
                                    : <View style={{ width: 50 }}><Text>{' '}</Text></View>}
                            </Flex>
                        </View>
                        <View style={{ flex: 1, width: '100%' }}>
                            <Box w="100%" p="2" borderBottomWidth={1} borderBottomColor="#e5e5e5">
                                <Input
                                    placeholder={'Search'}
                                    value={this.state.search}
                                    onChangeText={(value) => this.setState((s: SelectComponentState) => {
                                        s.search = value;
                                        return s;
                                    })} />
                            </Box>
                            <FlatList
                                initialNumToRender={this.props.initialNumToRender || 18}
                                data={this.props.data.filter(x => !this.state.search || this.props.getDescription(x).toLowerCase().indexOf(this.state.search.toLowerCase()) != -1)}
                                extraData={this.props.selected || this.props.selecteds}
                                renderItem={this.renderItem}
                                keyExtractor={item => this.props.getId(item).toString()}
                                ListFooterComponent={() => <View style={{ height: 80 }} />}
                                ListEmptyComponent={() => (
                                    <Flex p={5} align="center">
                                        <Text fontSize="md" italic={true} bold={true}>{'No results found'}</Text>
                                    </Flex>)} />
                            {this.props.doNotCloseOnSelect && <ActionButton
                                buttonColor="rgba(127,180,50,1)"
                                onPress={this.closeModal}
                                renderIcon={() => <Icon name="checkmark" as={Ionicons} color="white" size={8} />} />}
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        );
    }

    renderItem(data: any) {
        let id = this.props.getId(data.item);
        let selected = this.props.selected == id || this.props.selecteds && this.props.selecteds.some(x => x == id);

        return (
            <TouchableOpacity key={id}
                onPress={() => {
                    if (!this.props.doNotCloseOnSelect)
                        this.setState((s: SelectComponentState) => {
                            s.showModal = false;
                            return s;
                        });

                    if (this.props.onSelected)
                        this.props.onSelected(id);
                    else {
                        var selecteds = this.getSelecteds();

                        var index = selecteds.findIndex(x => x == id);
                        if (index == -1)
                            selecteds.push(id);
                        else
                            selecteds.splice(index, 1);

                            this.props.onSelecteds && this.props.onSelecteds(selecteds);
                    }
                }}>
                <Flex h={[60, 65]} pl={3}
                    direction="column" justify="center"
                    bg={selected ? "#0ea5e9" : "white"}
                    borderBottomWidth={1} borderBottomColor="#e5e5e5">
                    <Text fontSize="md" color={selected ? "white" : "black"}>
                        {this.props.getDescription(data.item)}
                    </Text>
                </Flex>
            </TouchableOpacity>
        );
    }
}