import { AppDispatch } from "../store";
import { LayoutConfig, } from "./layoutModels";
import { setLayoutConfig } from "./layoutSlice";

const layoutConfigKey = "hs-layout";

export function saveLayoutConfig(config: LayoutConfig) {
    localStorage.setItem(layoutConfigKey, JSON.stringify(config));
}

export function restoreLayoutConfig(dispatch: AppDispatch) {
    const layoutConfig = localStorage.getItem(layoutConfigKey);
    if(layoutConfig)
        dispatch(setLayoutConfig(JSON.parse(layoutConfig)));
}