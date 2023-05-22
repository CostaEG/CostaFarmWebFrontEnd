import { Filter, Entity, normalizeIdValues } from '../../core/models';

export const wmsTitle = 'Wms';
export const wmsPath = '/wms';

export enum WmsTier {
  VIP = 1,
  Medium,
  Small,
}

export const wmsTierList = normalizeIdValues([
  { value: WmsTier.VIP, label: 'VIP' },
  { value: WmsTier.Medium, label: 'Medium' },
  { value: WmsTier.Small, label: 'Small' },
]);

export interface Wms extends Entity {
  name: string;
  categoryId?: number;
  wmsCategory?: WmsCategory;
  standardTier: WmsTier;
  notes: string;
  defaultDiscountPercentage: number;
  overdueAccount: boolean;
  tags?: WmsTag[];
}

export interface WmsFilter extends Filter {
  categoryIds?: number[];
  tagIds?: number[];
  overdue?: boolean;
  standardTier?: WmsTier;
  createdFrom?: string;
  createdTo?: string;
}

export interface WmsCategory extends Entity {
  code: string;
  name: string;
}

export interface WmsTag extends Entity {
  tag: string;
}
