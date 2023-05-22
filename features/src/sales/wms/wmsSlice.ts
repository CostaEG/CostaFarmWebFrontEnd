import { createSlice } from '@reduxjs/toolkit';
import { patchFilterSliceFactory } from '../../core/crud/crudService';
import { configureReducer, injectReducer } from '../../core/store';
import { WmsFilter } from './wmsModels';

export interface WmsState {
  filter: WmsFilter;
}

const initialState: WmsState = {
  filter: {
    search: '',
    skip: 0,
    top: 20,
    archived: false,
  },
};

var { name, getState } = configureReducer({
  wms: initialState,
});

export type WmsReducerState = ReturnType<typeof getState>;

export const wmsSlice = createSlice({
  name,
  initialState,
  reducers: {
    patchWmsFilter: patchFilterSliceFactory<WmsFilter, WmsState>(),
  },
});

injectReducer(name, wmsSlice.reducer);

export const { patchWmsFilter } = wmsSlice.actions;

export const selectWmsFilter = (state: WmsReducerState) => state.wms.filter;
