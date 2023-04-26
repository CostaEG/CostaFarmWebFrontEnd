import { useMemo } from "react";
import CrudForm from "../../../core/crud/mobile/CrudForm";
import { DateFieldInput } from "../../../core/crud/mobile/DateFieldInput";
import { NumberFieldInput } from "../../../core/crud/mobile/NumberFieldInput";
import { SelectIdFieldInput } from "../../../core/crud/mobile/SelectIdFieldInput";
import { SalesProduct, SalesOrder, SalesOrderItem, SalesOrderStatus, salesOrderTitle, salesOrdersPath } from "../salesOrderModels";
import { useSalesProductsQuery, salesOrderService } from "../salesOrderService";
import { Customer } from "../../customers/customerModels";
import { useGetAllCustomerQuery } from "../../customers/customerService";
import { ListFieldInput } from "../../../core/crud/mobile/ListFieldInput";
import { Flex, HStack, Icon } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function SalesOrderForm() {
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
                <>
                    <SelectIdFieldInput<Customer>
                        label="Customer"
                        fieldName="customerId"
                        isFetching={isFetchingCustomers}
                        options={customers}
                        getOptionValue={x => x.id}
                        getOptionLabel={x => x.name}
                        require
                        disabled={submitting}
                    />
                    <DateFieldInput label="Shipping Date" fieldName="activationDate" require disabled={submitting} />
                    <NumberFieldInput label="Shipping Cost" fieldName="shippingAmount" min={0} unit="$" unitPosition="start" disabled={submitting} />
                    <ListFieldInput<SalesOrderItem>
                        label="Products"
                        fieldName="items"
                        columns={[
                            {
                                render: (name, index, disabled) => (
                                    <HStack>
                                        <Flex grow={1}>
                                            <SelectIdFieldInput<SalesProduct>
                                                label="Product"
                                                fieldName={`${name}.salesProductId`}
                                                isFetching={isFetchingProducts}
                                                options={products}
                                                getOptionValue={x => x.id}
                                                getOptionLabel={x => x.name}
                                                require
                                                disabled={disabled}
                                                helperText={''}
                                                fullWidth
                                            />
                                        </Flex>
                                        <TouchableOpacity 
                                            onPress={()=> remove("items", index)} 
                                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                        >
                                            <Icon name="trash-outline" as={Ionicons} color="#6c757d" size={6}/>
                                        </TouchableOpacity>
                                    </HStack>
                                )
                            },
                            {
                                render: (name, _, disabled) => (
                                    <NumberFieldInput 
                                        label="Quantity"
                                        variant="integer"
                                        fieldName={`${name}.quantity`}
                                        min={1}
                                        disabled={disabled}
                                        helperText={''}
                                    />
                                )
                            },
                            {
                                render: (name, _, disabled) => (
                                    <NumberFieldInput
                                        label="Price"
                                        fieldName={`${name}.price`}
                                        min={0}
                                        unit="$"
                                        unitPosition="start"
                                        disabled={disabled}
                                        helperText={''}
                                    />
                                )
                            }
                        ]}
                        require
                        disabled={submitting}
                        emptyText={"Add at least one product"}
                    />
                </>
            )}
            getButtons={(submitting, { push }) => [
                {
                    title: "Add Product",
                    color: "#4caf50",
                    icon: <Icon name="playlist-add" as={MaterialIcons} color="white" size={7} />,
                    disable: submitting,
                    onClick: () => {
                        push<SalesOrderItem>(
                            "items",
                            {
                                id: 0,
                                quantity: 0,
                                price: 0
                            }
                        );
                    }
                }
            ]}
        />
    );
}
