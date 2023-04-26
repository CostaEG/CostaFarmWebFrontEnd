import { Filter, Entity, normalizeIdValues } from "../../core/models";

export const customerTitle = "Customer";
export const customersPath = '/customers';

export enum CustomerTier {
    VIP = 1,
    Medium,
    Small
}

export const customerTierList = normalizeIdValues([
	{ value: CustomerTier.VIP, label: 'VIP' },
	{ value: CustomerTier.Medium, label: 'Medium' },
	{ value: CustomerTier.Small, label: 'Small' }
]);

export interface Customer extends Entity {
    name: string;
    categoryId?: number;
    customerCategory?: CustomerCategory;    
    standardTier: CustomerTier;
    notes: string;
    defaultDiscountPercentage: number;    
    overdueAccount: boolean;
    tags?: CustomerTag[];    
}

export interface CustomerFilter extends Filter {
    categoryIds?: number[];
    tagIds?: number[];
    overdue?: boolean;
    standardTier?: CustomerTier;
    createdFrom?: string;
    createdTo?: string;
}

export interface CustomerCategory extends Entity {
	code: string;
	name: string;    
}

export interface CustomerTag extends Entity {
	tag: string;    
}
