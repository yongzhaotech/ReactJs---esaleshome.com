import type { Identifier } from './common';

export type SearchMode = '' | 'Search';

export interface Advertise {
	id: Identifier;
	picture_ids: Identifier[];
	picture_id: Identifier;
	name: string;
	price: string | number;
	price_display: Record<string, string>;
	create_date: string;
	city: Record<string, string>;
	province: Record<string, string>;
	address?: string;
	description: string;
	contact_phone?: string;
	contact_method?: string;
	contact_email?: string;
}
