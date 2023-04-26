import { createSlice, isRejectedWithValue, Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import { LayoutConfig } from './layoutModels';
import { getErrorMessage } from '../form/validation';

export interface LayoutState {
    featureTitle: string;
    isMenuOpen: boolean;
    openedCategory: string | undefined;
    globalError?: string | string[];
}

const initialState: LayoutState = {
    featureTitle: '',
    isMenuOpen: false,
    openedCategory: undefined,
    globalError: undefined
};

export type LayoutReducerState = {
    layout: LayoutState;
};

export const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        setFeatureTitle: (state, action: PayloadAction<string>) => {
            state.featureTitle = action.payload;
        },
        toggleLeftMenu: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
        setLayoutConfig: (state, action: PayloadAction<LayoutConfig>) => {
            state.isMenuOpen = action.payload.isMenuOpen;
        },
        openMenuCategory: (state, action: PayloadAction<string | undefined>) => {
            state.openedCategory = action.payload;
        },
        setGlobalError: (state, action: PayloadAction<string | string[] | undefined>) => {
            state.globalError = action.payload;
        },
    }
});

const errorMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action) && action.type === "api/executeQuery/rejected") {
            api.dispatch(setGlobalError(getErrorMessage(action.payload)));
        }
        return next(action)
    }

export const layoutRegistration = {
    reducer: layoutSlice.reducer,
    errorMiddleware
};

export const { setFeatureTitle, toggleLeftMenu, setLayoutConfig, openMenuCategory, setGlobalError } = layoutSlice.actions;

export const selectFeatureTitle = (state: LayoutReducerState) => state.layout.featureTitle;

export const selectIsMenuOpen = (state: LayoutReducerState) => state.layout.isMenuOpen;

export const selectOpenedCategory = (state: LayoutReducerState) => state.layout.openedCategory;

export const selectGlobalError = (state: LayoutReducerState) => state.layout.globalError;