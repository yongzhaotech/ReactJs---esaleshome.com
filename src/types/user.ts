import type { Identifier } from './common';

export interface UserAdvertiseItem {
	id: Identifier;
	name: string;
	viewed: number;
	description: string;
	is_free: Identifier;
	price: Identifier;
}
