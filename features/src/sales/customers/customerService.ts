import { addOrUpdateServiceFactory, archiveServiceFactory, filterServiceFactory, getByIdServiceFactory, recoverServiceFactory } from "../../core/crud/crudService";
import { api } from "../../core/service";
import { Customer, CustomerCategory, CustomerFilter, CustomerTag } from "./customerModels";
import { trafficControllerThunkFactory } from "../../core/utils";

const customerServiceBaseUrl = 'customer';

export const customerService = api.injectEndpoints({
    endpoints: (build) => ({
        customers: filterServiceFactory<Customer, CustomerFilter>(build, customerServiceBaseUrl),
        customerById: getByIdServiceFactory<Customer>(build, customerServiceBaseUrl),
        addOrUpdateCustomer: addOrUpdateServiceFactory<Customer>(build, customerServiceBaseUrl, (dispatch, handler) => {
            dispatch(customerService.util.updateQueryData("customers", undefined, handler));
        }),
        archiveCustomer: archiveServiceFactory<Customer>(build, customerServiceBaseUrl, (dispatch, handler) => {
            dispatch(customerService.util.updateQueryData("customers", undefined, handler));
        }),
        recoverCustomer: recoverServiceFactory<Customer>(build, customerServiceBaseUrl, (dispatch, handler) => {
            dispatch(customerService.util.updateQueryData("customers", undefined, handler));
        }),
        getAllCustomer: build.query<Customer[], void>({
            query: () => ({
                url: customerServiceBaseUrl,
                params: {
                    Skip: 0,
                    Top: 1000
                }
            })
        }),
        _checkCustomerName: build.mutation<void, { name: string, id?: number }>({
            query: (params) => ({
                url: `${customerServiceBaseUrl}/check-name`,
                method: 'POST',
                body: params
            })
        }),
        customerCategories: build.query<CustomerCategory[], void>({
            query: () => ({
                url: 'customer-category'
            })
        }),
        customerTags: build.query<CustomerTag[], void>({
            query: () => ({
                url: 'customer-tag'
            })
        }),
    }),
});

export const checkCustomerName = trafficControllerThunkFactory<{ name: string, id?: number }, void> (
    params => customerService.endpoints._checkCustomerName.initiate(params)
);

export const {
    useCustomersQuery,
    useCustomerByIdQuery,
    useAddOrUpdateCustomerMutation,
    useGetAllCustomerQuery,
    useCustomerCategoriesQuery,
    useCustomerTagsQuery
} = customerService;