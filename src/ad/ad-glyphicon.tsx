import React from 'react';
import { AdInfo } from '../common/ad-info';
import { Helper } from '../common/js-funcs';
import type { Advertise } from '../types/ad';
import { useAdvertiseFunctions } from '../hook/advertise-hook';

interface AdGlyphiconProps {
	ad: Pick<Advertise, 'id' | 'name' | 'contact_phone' | 'contact_method'>;
	OBJECTS: {
		DETAILFLAG?: string | number;
	};
}

const AdGlyphicon = ({ ad, OBJECTS }: AdGlyphiconProps) => {
	const { flagDetail } = useAdvertiseFunctions();
	return (
		<div className='glyphicon-group'>
			{AdInfo.byMail(ad) ? (
				<button
					type='button'
					className='action-button'
					aria-label='email the poster'
					onClick={() => Helper.attachActionBox('ask_poster', { id: ad.id, name: ad.name })}
				>
					<span className='glyphicon glyphicon-envelope' aria-hidden='true' />
				</button>
			) : null}
			{AdInfo.byPhone(ad) ? (
				<a href={`tel:${ad.contact_phone}`} aria-label='use your cell to call the poster'>
					<span className='glyphicon glyphicon-phone' aria-hidden='true' />
				</a>
			) : null}
			<button
				type='button'
				className='action-button'
				aria-label='send the ad to your friend'
				onClick={() => Helper.attachActionBox('email_friend', { id: ad.id, name: ad.name })}
			>
				<span className='glyphicon glyphicon-share' aria-hidden='true' />
			</button>
			<button type='button' className='action-button' aria-label='ad details' onClick={() => flagDetail(ad)}>
				<span
					className={`glyphicon glyphicon-${OBJECTS.DETAILFLAG === ad.id ? 'check' : 'unchecked'}`}
					aria-hidden='true'
				/>
			</button>
		</div>
	);
};

export default AdGlyphicon;
