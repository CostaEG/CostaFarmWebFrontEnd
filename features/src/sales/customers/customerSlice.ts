import { createSlice } from '@reduxjs/toolkit';
import { patchFilterSliceFactory } from '../../core/crud/crudService';
import { configureReducer, injectReducer } from '../../core/store';
import { CustomerFilter } from './customerModels';

export interface CustomersState {
    filter: CustomerFilter;
}

const initialState: CustomersState = {
    filter: {
        search: '',
        skip: 0,
        top: 20,
        archived: false
    }
};

var { name, getState } = configureReducer({
    customers: initialState
});

export type CustomersReducerState = ReturnType<typeof getState>;

export const customersSlice = createSlice({
    name,
    initialState,
    reducers: {
        patchCustomerFilter: patchFilterSliceFactory<CustomerFilter, CustomersState>(),        
    }
});

injectReducer(name, customersSlice.reducer);

export const { patchCustomerFilter } = customersSlice.actions;

export const selectCustomerFilter = (state: CustomersReducerState) =>state.customers.filter;

