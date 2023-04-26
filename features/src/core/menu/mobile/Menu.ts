import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { mainMenu } from "..";
import CustomerScene from "../../../sales/customers/mobile/CustomerScene";
import SalesOrderScene from "../../../sales/sales-orders/mobile/SalesOrderScene";
import Empty from "../../layout/mobile/Empty";
import SecurityScopes from "../../security/SecurityScopes";

mainMenu.push(
    {
        title: 'Customers',
        icon: 'storefront',
        iconFamily: MaterialIcons,
        path: 'customers',
        component: CustomerScene,
        scopes: [SecurityScopes.customersList, SecurityScopes.manageCustomers]
    },
    {
        title: 'Sales',
        icon: 'card-giftcard',
        iconFamily: MaterialIcons,
        path: 'sales',
        items: [
            {
                title: 'Sales Orders',
                icon: 'list-alt',
                iconFamily: MaterialIcons,
                path: 'orders',
                component: SalesOrderScene,
                scopes: [SecurityScopes.salesOrdersList, SecurityScopes.manageSalesOrders]
            },
            {
                title: 'Sales Availabilities',
                icon: 'playlist-add-check',
                iconFamily: MaterialIcons,
                path: 'availabilities',
                component: Empty
            },
            {
                title: 'Prebooks',
                icon: 'event-available',
                iconFamily: MaterialIcons,
                path: 'prebooks',
                component: Empty
            },
            {
                title: 'Demo',
                icon: 'AbcOutlined',
                iconFamily: MaterialIcons,
                path: 'demo',
                component: Empty,
                scopes: [SecurityScopes.demo]
            }
        ]
    },
    {
        title: 'Inventory',
        icon: 'inventory',
        iconFamily: MaterialIcons,
        path: 'inventory',
        items: [
            {
                title: 'Inventory Stocks',
                icon: 'clipboard-check-outline',
                iconFamily: MaterialCommunityIcons,
                path: 'stocks',
                component: Empty
            },
            {
                title: 'Inventory Receivings',
                icon: 'receipt-outline',
                iconFamily: Ionicons,
                path: 'receivings',
                component: Empty
            }
            ,
            {
                title: 'Inventory Adjustments',
                icon: 'sync-alt',
                iconFamily: MaterialIcons,
                path: 'adjustments',
                component: Empty
            }
        ]
    },
    {
        title: 'Integrations',
        icon: 'integration-instructions',
        iconFamily: MaterialIcons,
        path: 'integrations',
        items: [
            {
                title: 'Quickbooks Online',
                icon: 'share-social-outline',
                iconFamily: Ionicons,
                path: 'quick-books-online',
                component: Empty
            },
            {
                title: 'Sage',
                icon: 'share-social-outline',
                iconFamily: Ionicons,
                path: 'sage',
                component: Empty
            }
        ]
    },
    {
        title: 'Settings',
        icon: 'settings-outline',
        iconFamily: Ionicons,
        path: 'settings',
        items: [
            {
                title: 'Organization',
                icon: 'corporate-fare',
                iconFamily: MaterialIcons,
                path: 'organization',
                component: Empty
            },
            {
                title: 'Resources',
                icon: 'grass',
                iconFamily: MaterialIcons,
                path: 'resources',
                component: Empty
            }
        ]
    }
);