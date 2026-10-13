import React from 'react';
import { Grid } from 'react-bootstrap';
import AdvertiseSnippet from './advertise-snippet';

interface Advertise {
	id: string | number;
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
