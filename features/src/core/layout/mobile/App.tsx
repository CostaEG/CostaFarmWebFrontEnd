import { NativeBaseProvider, extendTheme } from "native-base";
import { NativeRouter  as Router } from "react-router-native";
import { Provider } from 'react-redux';
import '../../menu/mobile/Menu';
import { Authenticate } from "../../security/Authenticate";
import { store } from "../../store";
import Layout from "./Layout";
import { Login } from "../../security/mobile/Login";

const theme = extendTheme({
    colors: {
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        }
    }
});

export default function App() {
    return (
        <NativeBaseProvider theme={theme}>
            <Router>
                <Provider store={store}>
                    <Authenticate LoginComponent={Login}>
                        <Layout/>
                    </Authenticate>
                </Provider>
            </Router>
        </NativeBaseProvider>        
    );
}