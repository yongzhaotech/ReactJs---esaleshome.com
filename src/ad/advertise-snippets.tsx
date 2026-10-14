import React from 'react';
import { Grid } from 'react-bootstrap';
import AdvertiseSnippet from './advertise-snippet';

export interface Advertise {
	id: string | number;
	picture_ids: (string | number)[];
	picture_id: string | number;
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

interface AdvertiseSnippetsProps {
	ads: Advertise[];
}

const AdvertiseSnippets = ({ ads }: AdvertiseSnippetsProps) => (
	<Grid>
		{ads.map(ad => <AdvertiseSnippet key={ad.id} ad={ad} />)}
	</Grid>
);

export default React.memo(AdvertiseSnippets);
