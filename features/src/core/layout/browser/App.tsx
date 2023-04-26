import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import './App.css';
import '../../menu/browser/Menu';
import { store } from '../../store';
import { Authenticate } from '../../security/Authenticate';
import Login from '../../security/browser/Login';
import Layout from './Layout';

const theme = createTheme({
    palette: {
        success: {
            main: "#4caf50"
        },
        warning: {
            main: "#eea236",
            dark: "#c08527"
        },
        error: {
            main: "#ef5350"
        }
    },
    components: {
        MuiFab: {
            styleOverrides: {
                root: {
                    color: "white"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "white",
                    minWidth: "80px"
                }
            }
        }
    },
    typography: {
        button: {
            textTransform: "none"
        }
    }
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Provider store={store}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Authenticate LoginComponent={Login}>
                            <Layout />
                        </Authenticate>
                    </LocalizationProvider>
                </Provider>
            </Router>
        </ThemeProvider>
    );
}
