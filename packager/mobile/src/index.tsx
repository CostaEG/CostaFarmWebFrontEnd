import { registerRootComponent } from 'expo';
import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import App from './workspace/core/layout/mobile/App';
import { safeAreaStyles } from './workspace/core/layout/mobile/SafeAreaStyles';
import { restoreIdentityAsync } from './workspace/core/security/mobile/utils';
import { store } from './workspace/core/store';
import * as WebBrowser from 'expo-web-browser';

SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession();

const fonts = [
    Ionicons.font,
    MaterialIcons.font,
    MaterialCommunityIcons.font
];

registerRootComponent(function () {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                const fontAssets = fonts.map(font => Font.loadAsync(font));

                await Promise.all(fontAssets);

                await restoreIdentityAsync(store.dispatch);
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        init();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
          await SplashScreen.hideAsync();
        }
      }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={safeAreaStyles.container} onLayout={onLayoutRootView}>
                <App />
            </SafeAreaView>
        </SafeAreaProvider>
    );
});