import { View, Text } from 'react-native';

export default function Unauthorized() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Unauthorized access</Text>
        </View>
    );
}