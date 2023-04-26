import CrudList from "../../../core/crud/mobile/CrudList";
import { useIsAuthorized } from "../../../core/hooks";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { SalesOrder, SalesOrderFilter, salesOrdersPath, salesOrderStatusList, salesOrderTitle } from "../salesOrderModels";
import { salesOrderService } from "../salesOrderService";
import { selectSalesOrderFilter, patchSalesOrderFilter } from "../salerOrderSlice";
import { FormattedDateTime } from "../../../core/formatting/FormattedDateTime";

export default function SalesOrderList() {
    const authorized = useIsAuthorized([SecurityScopes.manageSalesOrders]);

    return (
        <CrudList<SalesOrder, SalesOrderFilter>
            title={salesOrderTitle}
            path={salesOrdersPath}        
            listEndpoint={salesOrderService.endpoints.salesOrders}
            rowHeight={158}
            columns={[
                { variant: "column", title: "Order #", getter: x => x.id.toString() },
                { variant: "column", title: "Status", getter: x => salesOrderStatusList.values[x.orderStatus]?.label || '-' },                
                { variant: "column", fullWidth: true, title: "Shipping Date", getter: x => <FormattedDateTime variant="date" value={x.activationDate}/> },
                { variant: "title",  getter: x => x.customer?.name},                
            ]}
            selectFilter={selectSalesOrderFilter}
            patchFilterActionCreator={patchSalesOrderFilter}
            hideAddButton={!authorized}
        />
    );
}
