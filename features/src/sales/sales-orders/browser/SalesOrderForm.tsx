import { Button, GridProps, IconButton, Tooltip } from "@mui/material";
import { useMemo } from "react";
import CrudForm from "../../../core/crud/browser/CrudForm";
import { DateFieldInput } from "../../../core/crud/browser/DateFieldInput";
import { NumberFieldInput } from "../../../core/crud/browser/NumberFieldInput";
import { SelectIdFieldInput } from "../../../core/crud/browser/SelectIdFieldInput";
import { GridHS } from "../../../core/layout/browser/Grid";
import { SalesOrder, salesOrderTitle, salesOrdersPath, SalesOrderStatus, SalesOrderItem, SalesProduct } from "../salesOrderModels";
import { useSalesProductsQuery, salesOrderService } from "../salesOrderService";
import { Customer } from "../../customers/customerModels";
import { useGetAllCustomerQuery } from "../../customers/customerService";
import { ListFieldInput } from "../../../core/crud/browser/ListFieldInput";
import { getPropertyName } from "../../../core/form/initialValues";
import { DeleteOutline } from "@mui/icons-material";

export default function SalesOrderForm({ ...gridProps }: GridProps) {
    const { isFetching: isFetchingCustomers, data: customers } = useGetAllCustomerQuery();
    const { isFetching: isFetchingProducts, data: products } = useSalesProductsQuery();

    const defaultValues = useMemo<Partial<SalesOrder>>(() => ({
        id: 0,
        rowVersion: undefined,
        orderStatus: SalesOrderStatus.Draft,
        customerId: undefined,
        activationDate: undefined,
        shippingAmount: 0,
        items: []
    }), []);

    return (
        <CrudForm<SalesOrder>
            title={salesOrderTitle}
            path={salesOrdersPath}
            defaultValues={defaultValues}
            detailsEndpoint={salesOrderService.endpoints.salesOrderById}
            addOrUpdateEndpoint={salesOrderService.endpoints.addOrUpdateSalesOrder}
            confirmationMessage={_ => "Are you sure you want to submit the Order?"}
            acknowledgeMessage={order => {
                if (order.items?.some(x => x?.price === 0))
                    return "I am aware that the price of some items in the order is zero";

                return undefined;
            }}
            render={(submitting, { remove }) => (
                <GridHS container padding={2} columnSpacing={2}>
                    <GridHS xs={12}>
                        <SelectIdFieldInput<Customer>
                            label="Customer"
                            fieldName={getPropertyName<SalesOrder>(x => x.customerId)}
                            isFetching={isFetchingCustomers}
                            options={customers}
                            getOptionValue={x => x.id}
                            getOptionLabel={x => x.name}
                            require
                            disabled={submitting}
                        />
                    </GridHS>
                    <GridHS xs={12} md={6}>
                        <DateFieldInput label="Shipping Date" fieldName={getPropertyName<SalesOrder>(x => x.activationDate)} require disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12} md={6}>
                        <NumberFieldInput label="Shipping Cost" fieldName={getPropertyName<SalesOrder>(x => x.shippingAmount)} min={0} unit="$" unitPosition="start" disabled={submitting} />
                    </GridHS>
                    <GridHS xs={12}>
                        <ListFieldInput<SalesOrderItem>
                            fieldName={getPropertyName<SalesOrder>(x => x.items)}
                            columns={[
                                {
                                    title: "Product",
                                    width: "50%",
                                    render: (name, _, disabled) => (
                                        <SelectIdFieldInput<SalesProduct>
                                            fieldName={`${name}.${getPropertyName<SalesOrderItem>(x => x.salesProductId)}`}
                                            isFetching={isFetchingProducts}
                                            options={products}
                                            getOptionValue={x => x.id}
                                            getOptionLabel={x => x.name}
                                            require
                                            disabled={disabled}
                                            helperText={''}
                                        />                                       
                                    )
                                },
                                {
                                    title: "Quantity",
                                    width: "20%",
                                    render: (name, _, disabled) => (
                                        <NumberFieldInput
                                            variant="integer"
                                            fieldName={`${name}.${getPropertyName<SalesOrderItem>(x => x.quantity)}`}
                                            min={1}
                                            disabled={disabled}
                                            helperText={''}
                                        />
                                    )
                                },
                                {
                                    title: "Price",
                                    width: "30%",
                                    render: (name, index, disabled) => (
                                        <GridHS container spacing={0}>
                                            <GridHS xs>
                                                <NumberFieldInput
                                                    fieldName={`${name}.${getPropertyName<SalesOrderItem>(x => x.price)}`}
                                                    min={0}
                                                    unit="$"
                                                    unitPosition="start"
                                                    disabled={disabled}
                                                    helperText={''}
                                                />
                                            </GridHS>
                                            <GridHS>
                                                <Tooltip title="Filter list">
                                                    <IconButton sx={{ ml: 1 }} onClick={() => remove(getPropertyName<SalesOrder>(x => x.items), index)}>
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </Tooltip>
                                            </GridHS>
                                        </GridHS>  
                                    )
                                }
                            ]}
                            require
                            disabled={submitting}
                            emptyText={"Add at least one product"}
                        />
                    </GridHS>
                </GridHS>
            )}
            renderButtons={(submitting, { push }) => (
                <GridHS>
                    <Button variant="contained" color="success" disabled={submitting}
                        onClick={() => {
                            push<SalesOrderItem>(
                                getPropertyName<SalesOrder>(x => x.items),
                                {
                                    id: 0,
                                    quantity: 0,
                                    price: 0
                                }
                            );
                        }}
                    >
                        Add Product
                    </Button>
                </GridHS>
            )}
            {...gridProps}
        />
    );
}
