import { addOrUpdateServiceFactory, archiveServiceFactory, filterServiceFactory, getByIdServiceFactory, recoverServiceFactory } from "../../core/crud/crudService";
import { api } from "../../core/service";
import { SalesOrder, SalesProduct, SalesOrderFilter } from "./salesOrderModels";

const salesOrderServiceBaseUrl = 'sales-order';

export const salesOrderService = api.injectEndpoints({
    endpoints: (build) => ({
        salesOrders: filterServiceFactory<SalesOrder, SalesOrderFilter>(build, salesOrderServiceBaseUrl),
        salesOrderById: getByIdServiceFactory<SalesOrder>(build, salesOrderServiceBaseUrl),
        addOrUpdateSalesOrder: addOrUpdateServiceFactory<SalesOrder>(build, salesOrderServiceBaseUrl, (dispatch, handler) => {
            dispatch(salesOrderService.util.updateQueryData("salesOrders", undefined, handler));
        }),
        archiveSalesOrder: archiveServiceFactory<SalesOrder>(build, salesOrderServiceBaseUrl, (dispatch, handler) => {
            dispatch(salesOrderService.util.updateQueryData("salesOrders", undefined, handler));
        }),
        recoverSalesOrder: recoverServiceFactory<SalesOrder>(build, salesOrderServiceBaseUrl, (dispatch, handler) => {
            dispatch(salesOrderService.util.updateQueryData("salesOrders", undefined, handler));
        }),
        salesProducts: build.query<SalesProduct[], void>({
            query: () => ({
                url: `${salesOrderServiceBaseUrl}/products`
            })
        }),
    }),
});

export const {
    useSalesOrdersQuery,
    useSalesOrderByIdQuery,
    useAddOrUpdateSalesOrderMutation,
    useSalesProductsQuery
} = salesOrderService;