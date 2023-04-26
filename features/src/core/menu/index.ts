import { LazyExoticComponent } from "react";

export interface MainMenuCategory {
    title: string;
    icon: string;
    iconFamily?: any;
    iconSize?: number;
    path: string;
    items: MainMenuItem[];
}

export interface MainMenuItem {
    title: string;
    icon: string;
    iconFamily?: any;
    iconSize?: number;
    path: string;
    component: LazyExoticComponent<any> | (() => JSX.Element);
    scopes?: string[];
}

export const mainMenu: (MainMenuCategory | MainMenuItem | undefined)[] = [];
