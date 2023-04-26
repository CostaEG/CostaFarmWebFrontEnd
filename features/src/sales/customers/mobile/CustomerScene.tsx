import { Route, Routes } from "react-router-native";
import CustomerDetails from "./CustomerDetails";
import CustomerForm from "./CustomerForm";
import CustomerList from "./CustomerList";
import CustomerFilterForm from "./CustomerFilterForm";

export default function CustomerScene() {
    return (
        <Routes>
            <Route path="filter" element={
                <CustomerFilterForm />
            } />
            <Route path=":id" element={
                <CustomerDetails />
            } />
            <Route path=":id?/form" element={
                <CustomerForm />
            } />
            <Route path="*" element={
                <CustomerList />
            } />
        </Routes>
    );
}
