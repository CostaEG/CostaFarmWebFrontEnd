import CrudList from "../../../core/crud/mobile/CrudList";
import { useIsAuthorized } from "../../../core/hooks";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { Customer, CustomerFilter, customersPath, customerTitle } from "../customerModels";
import { customerService } from "../customerService";
import { selectCustomerFilter, patchCustomerFilter } from "../customerSlice";

export default function CustomerList() {
    const authorized = useIsAuthorized([SecurityScopes.manageCustomers]);

    return (
        <CrudList<Customer, CustomerFilter>
            title={customerTitle}
            path={customersPath}
            listEndpoint={customerService.endpoints.customers}
            columns={[
                { variant: "row",  getter: x => x.name }
            ]}
            selectFilter={selectCustomerFilter}
            patchFilterActionCreator={patchCustomerFilter}
            hideAddButton={!authorized}
        />
    );
}
