import React from 'react';
import { Grid } from 'react-bootstrap';
import AdvertiseSnippet from './advertise-snippet';
import type { Advertise } from '../types/ad';

interface AdvertiseSnippetsProps {
	ads: Advertise[];
}

const AdvertiseSnippets = ({ ads }: AdvertiseSnippetsProps) => (
	<Grid>
		{ads.map(ad => <AdvertiseSnippet key={ad.id} ad={ad} />)}
	</Grid>
);

export default React.memo(AdvertiseSnippets);
