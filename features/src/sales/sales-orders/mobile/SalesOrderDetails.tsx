import CrudDetails from "../../../core/crud/mobile/CrudDetails";
import { CurrencyFieldOutput } from "../../../core/crud/mobile/CurrencyFieldOutput";
import { DateTimeFieldOutput } from "../../../core/crud/mobile/DateTimeFieldOutput";
import ListFieldOutput from "../../../core/crud/mobile/ListFieldOutput";
import { StringFieldOutput } from "../../../core/crud/mobile/StringFieldOutput";
import { FormattedCurrency } from "../../../core/formatting/FormattedCurrency";
import { FormattedNumber } from "../../../core/formatting/FormattedNumber";
import { useIsAuthorized } from "../../../core/hooks";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { SalesOrder, salesOrderStatusList, salesOrdersPath, salesOrderTitle } from "../salesOrderModels";
import { salesOrderService } from "../salesOrderService";

export default function SalesOrderDetails() {
	const authorized = useIsAuthorized([SecurityScopes.manageSalesOrders]);
	
	return (
		<CrudDetails<SalesOrder>
			title={salesOrderTitle}
			path={salesOrdersPath}        
			detailsEndpoint={salesOrderService.endpoints.salesOrderById}
			hideEditButton={!authorized}
			archiveEndpoint={authorized ? salesOrderService.endpoints.archiveSalesOrder : undefined}
			recoverEndpoint={authorized ? salesOrderService.endpoints.recoverSalesOrder : undefined}
			render={model => (
				<>
					<StringFieldOutput label="Order #" value={model.id.toString()}/>
					<StringFieldOutput label="Order Status" value={salesOrderStatusList.values[model.orderStatus].label}/>
					<StringFieldOutput label="Customer" value={model.customer?.name} />
					<DateTimeFieldOutput label="Shipping Date" value={model.activationDate} variant="date" />
					<CurrencyFieldOutput label="Shipping Cost" value={model.shippingAmount} maximumFractionDigits={2}/>
					<ListFieldOutput 
						label="Products"
						values={model.items} 
						columns={[
							{ variant: "title",  getter: x => x.salesProduct?.name || '-'},
							{ variant: "column", title: "Quantity", getter: x => <FormattedNumber value={x.quantity} maximumFractionDigits={2}/> },
							{ variant: "column", title: "Price", getter: x => <FormattedCurrency value={x.price} maximumFractionDigits={2}/> },
						]}
					/>
				</>
			)}
		/>
	);
}
