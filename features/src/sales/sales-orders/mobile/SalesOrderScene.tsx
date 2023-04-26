import { Route, Routes } from "react-router-native";
import SalesOrderDetails from "./SalesOrderDetails";
import SalesOrderForm from "./SalesOrderForm";
import SalesOrderList from "./SalesOrderList";
import SalesOrderFilterForm from "./SalesOrderFilterForm";

export default function SalesOrderScene() {
    return (
        <Routes>
            <Route path="filter" element={
                <SalesOrderFilterForm />
            } />
            <Route path=":id" element={
                <SalesOrderDetails />
            } />
            <Route path=":id?/form" element={
                <SalesOrderForm />
            } />
            <Route path="*" element={
                <SalesOrderList />
            } />
        </Routes>
    );
}
