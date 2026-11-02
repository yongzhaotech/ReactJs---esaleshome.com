import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AdInfo } from '../common/ad-info';
import { smallImageSrc } from '../common/config';
import Glyphicon from './ad-glyphicon';
import type { Advertise } from '../types/ad';
import { useLocalizationContext } from '../context/localization-context';
import { useAdvertiseFunctions } from '../hook/advertise-hook';

interface AdvertiseSnippetProps {
	ad: Advertise;
}

interface AdvertiseSnippetState {
	language: string;
	OBJECTS: {
		DETAILFLAG?: string | number;
	};
}

const AdvertiseSnippet = ({ ad }: AdvertiseSnippetProps) => {
	const OBJECTS = useSelector((state: AdvertiseSnippetState) => state.OBJECTS),
		[failedImageId, setFailedImageId] = useState<Advertise['picture_id'] | null>(null),
		photo = +ad.picture_id ? 'photo' : '',
		image = +ad.picture_id && failedImageId !== ad.picture_id ? ad.picture_id : '0';

	const { lang: LANGUAGE, getLocalizedLabel: getLabel } = useLocalizationContext();
	const { viewImages, flagDetail } = useAdvertiseFunctions();

	return (
		<div className='col-xs-6 col-sm-4 col-md-3'>
			<div className={`ad_block ${OBJECTS.DETAILFLAG === ad.id ? 'dtl_bk' : ''}`}>
				<div className={`block_icon ${photo}`}>
					<button
						type='button'
						className='action-button'
						aria-label='View larger image'
						onClick={() => viewImages(ad)}
					>
						<img
							src={`${smallImageSrc}${image}.jpg`}
							className='img-thumbnail ad_image'
							alt={ad.name}
							onError={() => {
								if (image !== '0') {
									setFailedImageId(ad.picture_id);
								}
							}}
						/>
					</button>
				</div>
				<div className='block_spacer'></div>
				<div className='block_price'>
					<span className='badge'>{ad.price_display[LANGUAGE]}</span>
				</div>
				<div className='block_price'>
					{getLabel('r_ad_listed')}: {ad.create_date}
				</div>
				<div className='block_info'>
					<Link className='react-link' to={`/ads/ad-detail/${ad.id}`}>
						{ad.name}
					</Link>
				</div>
				<div className='block_info'>
					<span>{ad.city[LANGUAGE]}</span>, <span>{ad.province[LANGUAGE]}</span>
				</div>
				<div className='block_info'>
					<Glyphicon ad={ad} OBJECTS={OBJECTS} />
				</div>
				<div className='block_spacer'></div>
				{OBJECTS.DETAILFLAG === ad.id ? <div className='sm_spacer'></div> : null}
			</div>
			<div
				className='message_desc'
				aria-label={`${OBJECTS.DETAILFLAG === ad.id ? 'show-description' : 'hide-description'}`}
			>
				<div>
					<div className='dtl_address'>
						{ad.address ? <span>{ad.address}, </span> : null}
						<span>
							{ad.city[LANGUAGE]}, {ad.province[LANGUAGE]}
						</span>
					</div>
					{AdInfo.safeHtml(ad.description)}
					<div className='ang_close icon_list' onClick={() => flagDetail(ad)}>
						&times;
					</div>
				</div>
			</div>
			<div className='block_spacer'></div>
		</div>
	);
};

export default AdvertiseSnippet;
