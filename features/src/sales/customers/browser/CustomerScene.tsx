import { Route, Routes, useMatch } from "react-router-dom";
import CustomerDetails from "./CustomerDetails";
import CustomerForm from "./CustomerForm";
import CustomerList from "./CustomerList";
import { Scene } from "../../../core/layout/browser/Scene";
import { customersPath } from "../customerModels";
import { useMediaQuery, useTheme } from "@mui/material";

export default function CustomerScene() {
    const theme = useTheme();
  	const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const onlyList = useMatch(customersPath);
    
    return (
        <Scene>
            <CustomerList xs={12} md={6} lg={4} sx={{ display: mdDown && !onlyList ? 'none' : undefined }}/>
            <Routes>
                <Route path=":id" element={
                    <CustomerDetails xs={12} md={6} xl={5}/>
                }/>
                <Route path=":id?/form" element={
                    <CustomerForm xs={12} md={6} xl={5}/>
                }/>
            </Routes>
        </Scene>
    );
}
