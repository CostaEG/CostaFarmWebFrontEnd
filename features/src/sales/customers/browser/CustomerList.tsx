import { GridProps } from "@mui/material";
import CustomerFilterForm from "./CustomerFilterForm";
import { useIsAuthorized } from "../../../core/hooks";
import CrudList from "../../../core/crud/browser/CrudList";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { Customer, CustomerFilter, customersPath } from "../customerModels";
import { customerService } from "../customerService";
import { selectCustomerFilter, patchCustomerFilter } from "../customerSlice";

export default function CustomerList({ ...gridProps }: GridProps) {
    const authorized = useIsAuthorized([SecurityScopes.manageCustomers]);

    return (
        <CrudList<Customer, CustomerFilter>
            path={customersPath}
            listEndpoint={customerService.endpoints.customers}
            listColumns={[
                { title: "Id", getter: x => x.id.toString(), width: "25%" },
                { title: "Name", getter: x => x.name },
            ]}
            selectFilter={selectCustomerFilter}
            patchFilterActionCreator={patchCustomerFilter}
            FilterFormComponent={CustomerFilterForm}
            hideAddButton={!authorized}
            {...gridProps}
        />
    );
}
