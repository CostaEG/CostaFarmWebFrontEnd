import { BooleanFieldOutput } from "../../../core/crud/mobile/BooleanFieldOutput";
import { CollectionFieldOutput } from "../../../core/crud/mobile/CollectionFieldOutput";
import CrudDetails from "../../../core/crud/mobile/CrudDetails";
import { DateTimeFieldOutput } from "../../../core/crud/mobile/DateTimeFieldOutput";
import { NumberFieldOutput } from "../../../core/crud/mobile/NumberFieldOutput";
import { StringFieldOutput } from "../../../core/crud/mobile/StringFieldOutput";
import { useIsAuthorized } from "../../../core/hooks";
import SecurityScopes from "../../../core/security/SecurityScopes";
import { Customer, customerTierList, customersPath, customerTitle } from "../customerModels";
import { customerService } from "../customerService";

export default function CustomerDetails() {
	const authorized = useIsAuthorized([SecurityScopes.manageCustomers]);
	
	return (
		<CrudDetails<Customer>
			title={customerTitle}
			path={customersPath}
			detailsEndpoint={customerService.endpoints.customerById}
			hideEditButton={!authorized}
			archiveEndpoint={authorized ? customerService.endpoints.archiveCustomer : undefined}
			recoverEndpoint={authorized ? customerService.endpoints.recoverCustomer : undefined}			
			render={model => (
				<>
					<StringFieldOutput label="Id" value={model.id.toString()} />
					<StringFieldOutput label="Name" value={model.name} />
					<StringFieldOutput label="Customer Tier" value={model.standardTier === undefined ? '-' : customerTierList.values[model.standardTier]?.label || '-'} />
					<StringFieldOutput label="Category" value={model.customerCategory?.name} />
					<CollectionFieldOutput label="Tags" value={model.tags?.map(x => x.tag)} />
					<NumberFieldOutput label="Default Discount" value={model.defaultDiscountPercentage} maximumFractionDigits={2} unit="%" />
					<BooleanFieldOutput label="Overdue Account" value={model.overdueAccount} fullWidth/>
					<StringFieldOutput label="Notes" value={model.notes} fullWidth/>
					<DateTimeFieldOutput label="Registered At" value={model.createdAt} variant="date" />					
				</>
			)}
		/>
	);
}
