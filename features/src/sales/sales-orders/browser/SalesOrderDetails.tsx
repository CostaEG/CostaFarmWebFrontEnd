import { GridProps } from "@mui/material";
import { useIsAuthorized } from "../../../core/hooks";
import CrudDetails from "../../../core/crud/browser/CrudDetails";
import { DateTimeFieldOutput } from "../../../core/crud/browser/DateTimeFieldOutput";
import { StringFieldOutput } from "../../../core/crud/browser/StringFieldOutput";
import { GridHS } from "../../../core/layout/browser/Grid";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { SalesOrder, salesOrderStatusList, salesOrdersPath, salesOrderTitle } from "../salesOrderModels";
import { salesOrderService } from "../salesOrderService";
import { CurrencyFieldOutput } from "../../../core/crud/browser/CurrencyFieldOutput";
import ListFieldOutput from "../../../core/crud/browser/ListFieldOutput";
import { FormattedNumber } from "../../../core/formatting/FormattedNumber";
import { FormattedCurrency } from "../../../core/formatting/FormattedCurrency";

export default function SalesOrderDetails({ ...gridProps }: GridProps) {
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
				<GridHS container padding={2} columnSpacing={2} rowSpacing={3}>
					<GridHS xs={12} md={3}>
						<StringFieldOutput label="Order #" value={model.id.toString()}/>
					</GridHS>
					<GridHS xs={12} md={3}>
						<StringFieldOutput label="Order Status" value={salesOrderStatusList.values[model.orderStatus]?.label || '-'}/>
					</GridHS>
					<GridHS xs={12} md={6}>
						<StringFieldOutput label="Customer" value={model.customer?.name} />
					</GridHS>
					<GridHS xs={12} md={6}>
						<DateTimeFieldOutput label="Shipping Date" value={model.activationDate} variant="date" />
					</GridHS>
					<GridHS xs={12} md={6}>
						<CurrencyFieldOutput label="Shipping Cost" value={model.shippingAmount} maximumFractionDigits={2}/>
					</GridHS>					
					<GridHS xs={12}>
						<ListFieldOutput 
							values={model.items} 
							columns={[
								{ title: "Product", width: "50%", getter: x => x.salesProduct?.name || '-'},
								{ title: "Quantity", width: "25%", getter: x => <FormattedNumber value={x.quantity} maximumFractionDigits={2}/> },
								{ title: "Price", width: "25%", getter: x => <FormattedCurrency value={x.price} maximumFractionDigits={2}/> },
							]}
						/>
					</GridHS>
				</GridHS>
			)}
			{...gridProps}
		/>
	);
}
