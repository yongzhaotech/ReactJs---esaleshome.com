import React from 'react';
import AdvertiseSnippet from './advertise-snippet';
import type { Advertise } from '../types/ad';

interface AdvertiseSnippetsProps {
	ads: Advertise[];
}

const AdvertiseSnippets = ({ ads }: AdvertiseSnippetsProps) => (
	<div className='container'>
		{ads.map(ad => <AdvertiseSnippet key={ad.id} ad={ad} />)}
	</div>
);

export default React.memo(AdvertiseSnippets);
