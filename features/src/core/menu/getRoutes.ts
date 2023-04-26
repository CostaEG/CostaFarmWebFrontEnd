import { createSelector } from "@reduxjs/toolkit";
import { MainMenuCategory, MainMenuItem, mainMenu } from ".";

export const getRoutes = createSelector(
    () => undefined,
    () => mainMenu.filter(x => Boolean(x))
        .flatMap(
            x => {
                const category = x as MainMenuCategory;
                if (category?.items) {
                    return category.items.map(item => ({ item, category, routeInfo: getItemRouteInfo(category, item) }));
                }

                const item = x as MainMenuItem;
                return [{ item, routeInfo: getItemRouteInfo(undefined, item) }];
            }
        )
);

export function getCategoryRouteInfo(category: MainMenuCategory) {
    const path = `/${category.path}`;
    const routePath = `${path}/*`;

    return { path, routePath };
}

export function getItemRouteInfo(category: MainMenuCategory | undefined, item: MainMenuItem) {
    const path = `${category ? `/${category.path}` : ''}${item.path ? `/${item.path}` : '/'}`;
    const routePath = `${item.path ? `${path}/*` : path}`;

    return { path, routePath };
}