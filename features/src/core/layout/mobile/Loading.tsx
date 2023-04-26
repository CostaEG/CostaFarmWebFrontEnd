import { Flex, Spinner } from 'native-base';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';

interface LoadingProps {
    floating?: boolean
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      flex: 1,
    },
    loadingBody: {
      width: 70,
      height: 70,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 15
    }
});

export default function Loading({ floating }: LoadingProps) {
    if(floating) {
        let {width, height} = Dimensions.get('window');      
        let top = (height / 2) - 35;
        let left = (width / 2) - 35;

        return (
            <Modal animationType='none' visible={true} transparent={true} onRequestClose={() => {}}>
                <View style={styles.container} >
                    <View style={[styles.loadingBody, {top, left, alignItems: 'center', justifyContent: 'center'}]}>
                    <Spinner size="lg" color='#0ea5e9' />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Flex flex={1} pt={20}>
            <Spinner size="lg" color='#0ea5e9' />
        </Flex>
    );
}