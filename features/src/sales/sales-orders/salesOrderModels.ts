import { Filter, Entity, normalizeIdValues } from "../../core/models";
import { Customer } from "../customers/customerModels";

export const salesOrderTitle = "Sales Order";
export const salesOrdersPath = '/sales/orders';

export enum SalesOrderStatus {
	Draft,
	InProgress,
	Completed,
	Cancelled
}

export const salesOrderStatusList = normalizeIdValues([
	{ value: SalesOrderStatus.Draft, label: 'Draft' },
	{ value: SalesOrderStatus.InProgress, label: 'InProgress' },
	{ value: SalesOrderStatus.Completed, label: 'Completed' },
	{ value: SalesOrderStatus.Cancelled, label: 'Cancelled' }
]);

export enum PaymentStatus {
	AwaitingPayment,
	Paid
}

export const paymentStatusList = normalizeIdValues([
	{ value: PaymentStatus.AwaitingPayment, label: 'Awaiting Payment' },
	{ value: PaymentStatus.Paid, label: 'Paid' }
]);

export enum ShippingStatus {
	NoShipmentRequired,
	PendingShipping,
	PartialShipment,
	Shipped
}

export const shippingStatusList = normalizeIdValues([
	{ value: ShippingStatus.NoShipmentRequired, label: 'No Shipment Required' },
	{ value: ShippingStatus.PendingShipping, label: 'Pending Shipping' },
	{ value: ShippingStatus.PartialShipment, label: 'Partial Shipment' },
	{ value: ShippingStatus.Shipped, label: 'Shipped' }
]);

export enum ShippingType {
	NoShipmentRequired,
	InStorePickup,
	Bussines,
	Residential
}

export const shippingTypeList = normalizeIdValues([
	{ value: ShippingType.NoShipmentRequired, label: 'No Shipment Required' },
	{ value: ShippingType.InStorePickup, label: 'In Store Pickup' },
	{ value: ShippingType.Bussines, label: 'Bussines' },
	{ value: ShippingType.Residential, label: 'Residential' }
]);

export interface SalesOrder extends Entity {
    activationDate: string;
	sellerName?: string;
	customerId: number;
	customer: Customer;
    
	orderStatus: SalesOrderStatus;
	paymentStatus: PaymentStatus;
	shippingStatus: ShippingStatus;
	shippingType: ShippingType;

	taxAmount: number;
	shippingAmount: number;
	totalAmount: number;
	paidAmount: number;

    items: SalesOrderItem[];	
}

export interface SalesOrderItem extends Entity {
	description?: string;
	quantity: number;	
    price: number;	
	notes?: string;

	salesOrderId?: number;
	salesOrder?: SalesOrder;
	
	salesProductId?: number;
	salesProduct?: SalesProduct;	
}

export interface SalesProduct extends Entity {
	code: string;
    name: string;
	defaultPrice: number;
}

export interface SalesOrderFilter extends Filter {
	customerId?: number;
    orderStatus?: SalesOrderStatus;
	paymentStatus?: PaymentStatus;
	shippingStatus?: ShippingStatus;
	productCode?: string;
	dateFrom?: string;
	dateTo?: string;
}