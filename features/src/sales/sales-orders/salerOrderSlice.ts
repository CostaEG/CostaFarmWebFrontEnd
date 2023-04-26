import { createSlice } from '@reduxjs/toolkit';
import { patchFilterSliceFactory } from '../../core/crud/crudService';
import { configureReducer, injectReducer } from '../../core/store';
import { SalesOrderFilter } from './salesOrderModels';

export interface SalesOrdersState {
    filter: SalesOrderFilter;
}

const initialState: SalesOrdersState = {
    filter: {
        search: '',
        skip: 0,
        top: 20,
        archived: false
        //Status: [SalesOrderStatus.Draft, SalesOrderStatus.Shipping]
    }
};

var { name, getState } = configureReducer({
    salesOrders: initialState
});

export type SalesOrdersReducerState = ReturnType<typeof getState>;

export const SalesOrdersSlice = createSlice({
    name,
    initialState,
    reducers: {
        patchSalesOrderFilter: patchFilterSliceFactory<SalesOrderFilter, SalesOrdersState>(),        
    }
});

injectReducer(name, SalesOrdersSlice.reducer);

export const { patchSalesOrderFilter } = SalesOrdersSlice.actions;

export const selectSalesOrderFilter = (state: SalesOrdersReducerState) =>state.salesOrders.filter;

