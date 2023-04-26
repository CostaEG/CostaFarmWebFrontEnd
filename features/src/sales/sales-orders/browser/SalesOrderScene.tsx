import { Route, Routes, useMatch } from "react-router-dom";
import SalesOrderDetails from "./SalesOrderDetails";
import SalesOrderForm from "./SalesOrderForm";
import SalesOrderList from "./SalesOrderList";
import { Scene } from "../../../core/layout/browser/Scene";
import { salesOrdersPath } from "../salesOrderModels";
import { useMediaQuery, useTheme } from "@mui/material";

export default function SalesOrderScene() {
    const theme = useTheme();
  	const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const onlyList = useMatch(salesOrdersPath);
    
    return (
        <Scene>
            <SalesOrderList xs={12} md={6} lg={6} sx={{ display: mdDown && !onlyList ? 'none' : undefined }}/>
            <Routes>
                <Route path=":id" element={
                    <SalesOrderDetails xs={12} md={6} xl={6}/>
                }/>
                <Route path=":id?/form" element={
                    <SalesOrderForm xs={12} md={6} xl={6}/>
                }/>
            </Routes>
        </Scene>
    );
}
