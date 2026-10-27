import type { Identifier } from './common';

export type SearchMode = '' | 'Search';

export interface Advertise {
	id: Identifier;
	picture_ids: Identifier[];
	picture_id: Identifier;
	main_picture_id: Identifier;
	name: string;
	price: string | number;
	price_display: Record<string, string>;
	create_date: string;
	province: Record<string, string>;
	address?: string;
	description: string;
	contact_phone?: string;
	contact_method?: string;
	contact_email?: string;
	main_picture?: Identifier;
	is_free: Identifier;
	city: Record<string, string>;
	location: Record<string, string>;
	category: Record<string, string>;
	item: Record<string, string>;
}
