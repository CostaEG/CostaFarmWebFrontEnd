import { createSelector } from "@reduxjs/toolkit";
import { MainMenuCategory, MainMenuItem, mainMenu } from ".";
import { SecurityContext } from "../security/securityModels";
import { matchScopes } from "../security/securitySlice";

export const getFilteredMenu = createSelector(
    (securityContext: SecurityContext | undefined) => securityContext, 
    (securityContext: SecurityContext | undefined) => {
        const filteredMenu: (MainMenuItem | MainMenuCategory | undefined)[] = [];

        mainMenu.forEach(x => {
            if(!Boolean(x))
                filteredMenu.push(undefined);
            else {
                const category = x as MainMenuCategory;
                if(category.items) {
                    const items = category.items.filter(i => matchScopes(i.scopes, securityContext));
                    if(items.length > 0) {
                        filteredMenu.push({
                            title: category.title,
                            icon: category.icon,
                            iconFamily: category.iconFamily,
                            iconSize: category.iconSize,
                            path: category.path,
                            items
                        });
                    }
                }
                else {
                    const item = x as MainMenuItem;

                    if(matchScopes(item.scopes, securityContext)) {
                        filteredMenu.push(item);
                    }
                }
            }
        });

        return filteredMenu;
    }
);
