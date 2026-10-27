import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { fetchAdvertise } from '../action';
import SearchTerms from './search-terms';
import ReactLoader from './react-loader';
import { AdInfo } from '../common/ad-info';
import { Helper } from '../common/js-funcs';
import { smallImageSrc } from '../common/config';
import type { Identifier } from '../types/common';
import { route } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import { useAdvertiseFunctions } from '../hook/advertise-hook';

interface AdvertiseDetailData {
	id: Identifier;
	name: string;
	main_picture: Identifier;
	picture_ids: { i: Identifier }[];
	is_free: Identifier;
	price_display: Record<string, string>;
	province: Record<string, string>;
	city: Record<string, string>;
	location: Record<string, string>;
	category: Record<string, string>;
	item: Record<string, string>;
	contact_method?: string;
	contact_phone?: string;
	ad_description: Record<string, string>;
}
interface AdvertiseDetailState {
	advertiseDetail: AdvertiseDetailData | null;
	language: string;
}

const AdvertiseDetail = () => {
	const dispatch = useDispatch();
	const advertise = useSelector((state: AdvertiseDetailState) => state.advertiseDetail);
	const { lang, getLocalizedLabel: getLabel } = useLocalizationContext();
	const { viewImages } = useAdvertiseFunctions();
	const photo = advertise && advertise.main_picture ? 'photo' : '';

	useEffect(() => {
		dispatch(fetchAdvertise(route.param('advertiseId')));
	}, [dispatch]);

	if (!advertise) {
		return <ReactLoader />;
	}

	return (
		<>
			<SearchTerms />
			<div className='ad_detail_title'>{getLabel('c_ad_detail_title')}</div>
			<div className='ad_detail_wrapper' id='big_picture'>
				<div className={`ad_detail_img ${photo}`}>
					<button
						type='button'
						className='action-button'
						aria-label='View larger image'
						onClick={() => viewImages(advertise as any, { i: advertise.main_picture })}
					>
						<img
							className='ad_image'
							alt=''
							id='advertise_main_picture'
							src={`${smallImageSrc}${advertise.main_picture}.jpg`}
						/>
					</button>
				</div>
			</div>
			<div className='ad_detail_wrapper'>
				<div className='ad_detail_tab'>
					<div className='devider'></div>
					{AdInfo.byMail(advertise) && (
						<div>
							<Button
								bsStyle='primary'
								bsSize='small'
								onClick={() =>
									Helper.attachActionBox('ask_poster', { id: advertise.id, name: advertise.name })
								}
							>
								{getLabel('c_contact_poster_link')}
							</Button>
						</div>
					)}
					<div className='devider'></div>
					<div>
						<Button
							bsStyle='primary'
							bsSize='small'
							onClick={() =>
								Helper.attachActionBox('email_friend', { id: advertise.id, name: advertise.name })
							}
						>
							{getLabel('c_email_friend_link')}
						</Button>
					</div>
				</div>
			</div>
			<div className='ad_detail_wrapper'>
				<div className='ad_detail_fun'>
					<div className='devider'></div>
					<div className='ad_title'>{advertise.name}</div>
					<div className='devider'></div>
					<div className='ad_detail'>
						{+advertise.is_free !== 0 && <span>{getLabel('c_free_offer')}</span>}
						{+advertise.is_free === 0 && (
							<div className='ad_title'>
								{getLabel('c_ad_scr_price')}: {advertise.price_display[lang]}
							</div>
						)}
					</div>
					<div className='devider'></div>
					<div className='devider'></div>
					<div className='ad_detail'>{getLabel('c_ad_scr_location')}:</div>
					<div className='ad_title'>
						<div>{advertise.province[lang]}</div>
						<div>{advertise.city[lang]}</div>
						<div>{advertise.location[lang]}</div>
					</div>
					<div className='devider'></div>
					<div className='ad_title'>
						<div>{advertise.category[lang]}</div>
						<div>{advertise.item[lang]}</div>
					</div>
					{AdInfo.byPhone(advertise) && (
						<section>
							<div className='devider'></div>
							<div>
								{getLabel('c_call_poster')}:{' '}
								<span style={{ fontWeight: 'bold' }}>
									<a href={`tel:${advertise.contact_phone}`}>{advertise.contact_phone}</a>
								</span>
							</div>
						</section>
					)}
				</div>
			</div>
			<div id='advertise_picture_list'>
				{advertise.picture_ids.map((picture) => {
					return (
						<div key={picture.i} className='ad_detail_picture_wrapper'>
							<div className='ad_detail_picture' title='click to view large picture'>
								<button
									type='button'
									className='action-button'
									aria-label='View larger image'
									onClick={() => viewImages(advertise as any, { i: picture.i })}
								>
									<img className='ad_image' src={`${smallImageSrc}${picture.i}.jpg`} alt='' />
								</button>
							</div>
						</div>
					);
				})}
			</div>
			<div className='ad_detail_desc'>
				<div className='ad_name'>{getLabel('c_ad_scr_detail')}</div>
				{AdInfo.safeHtml(advertise.ad_description[lang])}
			</div>
		</>
	);
};

export default AdvertiseDetail;
