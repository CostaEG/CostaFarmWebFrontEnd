import { lazy } from "react";
import { mainMenu } from "..";
import Empty from "../../layout/browser/Empty";
import SecurityScopes from "../../security/SecurityScopes";

mainMenu.push(
    {
        title: 'Home',
        icon: 'GridViewOutlined',
        path: '',
        component: Empty
    },
    {
        title: 'Customers',
        icon: 'StorefrontOutlined',
        path: 'customers',
        component: lazy(() => import('../../../sales/customers/browser/CustomerScene')),
        scopes: [SecurityScopes.customersList, SecurityScopes.manageCustomers]
    },
    {
        title: 'Sales',
        icon: 'CardGiftcardOutlined',
        path: 'sales',
        items: [
            {
                title: 'Sales Orders',
                icon: 'ListAltOutlined',
                path: 'orders',
                component: lazy(() => import('../../../sales/sales-orders/browser/SalesOrderScene')),
                scopes: [SecurityScopes.salesOrdersList, SecurityScopes.manageSalesOrders]
            },
            {
                title: 'Sales Availabilities',
                icon: 'PlaylistAddCheckOutlined',
                path: 'availabilities',
                component: Empty
            },
            {
                title: 'Prebooks',
                icon: 'EventAvailableOutlined',
                path: 'prebooks',
                component: Empty
            },
            {
                title: 'Demo',
                icon: 'AbcOutlined',
                path: 'demo',
                component: Empty,
                scopes: [SecurityScopes.demo]
            }
        ]
    },
    {
        title: 'Inventory',
        icon: 'Inventory2Outlined',
        path: 'inventory',
        items: [
            {
                title: 'Inventory Stocks',
                icon: 'InventoryOutlined',
                path: 'stocks',
                component: Empty
            },
            {
                title: 'Inventory Receivings',
                icon: 'ReceiptLongOutlined',
                path: 'receivings',
                component: Empty
            }
            ,
            {
                title: 'Inventory Adjustments',
                icon: 'SyncAltOutlined',
                path: 'adjustments',
                component: Empty
            }
        ]
    },
    undefined,
    {
        title: 'Integrations',
        icon: 'IntegrationInstructionsOutlined',
        path: 'integrations',
        items: [
            {
                title: 'Quickbooks Online',
                icon: 'ShareOutlined',
                path: 'quick-books-online',
                component: Empty
            },
            {
                title: 'Sage',
                icon: 'ShareOutlined',
                path: 'sage',
                component: Empty
            }
        ]
    },
    {
        title: 'Settings',
        icon: 'SettingsOutlined',
        path: 'settings',
        items: [
            {
                title: 'Organization',
                icon: 'CorporateFareOutlined',
                path: 'organization',
                component: Empty
            },
            {
                title: 'Resources',
                icon: 'GrassOutlined',
                path: 'resources',
                component: Empty
            }
        ]
    }
);