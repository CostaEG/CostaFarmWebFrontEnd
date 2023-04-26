import { GridProps } from "@mui/material";
import SalesOrderFilterForm from "./SalesOrderFilterForm";
import { useIsAuthorized } from "../../../core/hooks";
import CrudList from "../../../core/crud/browser/CrudList";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { SalesOrder, SalesOrderFilter, salesOrderStatusList, salesOrdersPath } from "../salesOrderModels";
import { salesOrderService } from "../salesOrderService";
import { selectSalesOrderFilter, patchSalesOrderFilter } from "../salerOrderSlice";
import { FormattedDateTime } from "../../../core/formatting/FormattedDateTime";

export default function SalesOrderList({ ...gridProps }: GridProps) {
    const authorized = useIsAuthorized([SecurityScopes.manageSalesOrders]);

    return (
        <CrudList<SalesOrder, SalesOrderFilter>
            path={salesOrdersPath}
            listEndpoint={salesOrderService.endpoints.salesOrders}
            listColumns={[
                { title: "Order #", getter: x => x.id.toString(), width: "15%", compactWidth: "25%" },
                { title: "Status", getter: x => salesOrderStatusList.values[x.orderStatus].label, width: "15%", compactWidth: "0" },
                { title: "Shipping Date", getter: x => <FormattedDateTime variant="date" value={x.activationDate}/>, width: "20%", compactWidth: "0" },
                { title: "Customer", getter: x => x.customer?.name }
            ]}
            selectFilter={selectSalesOrderFilter}
            patchFilterActionCreator={patchSalesOrderFilter}
            FilterFormComponent={SalesOrderFilterForm}
            hideAddButton={!authorized}
            {...gridProps}
        />
    );
}
