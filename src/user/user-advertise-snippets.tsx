import React, { useCallback } from 'react';
import { AdInfo } from '../common/ad-info';
import { useSelector, useDispatch } from 'react-redux';
import RootReducer from '../reducer';
import { session } from '../utils';
import { useLocalizationContext } from '../context/localization-context';
import { useServerFunctions, useUserFunctions } from '../hook/user-function-hook';
import { saveStateObjects } from '../action';

import type { UserAdvertiseItem } from '../types/user';

type RootState = ReturnType<typeof RootReducer>;

type UserState = {
	profile?: Record<string, unknown>;
	ads?: UserAdvertiseItem[];
};

type ExpandState = { EXPANDEDADS: Record<string, number> };

const UserAdvertiseSnippets = () => {
	const dispatch = useDispatch();
	const { EXPANDEDADS = {} } = useSelector((state: RootState) => state.OBJECTS) as ExpandState;
	const { profile, ads } = useSelector((state: RootState) => state.USER) as UserState;
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const { deleteAd } = useServerFunctions();
	const { userPage } = useUserFunctions();
	const expand = useCallback(
		({ id }: UserAdvertiseItem) => {
			const expandedAds = { ...EXPANDEDADS };
			if (expandedAds[id] !== undefined) {
				delete expandedAds[id];
			} else {
				expandedAds[id] = 1;
			}
			dispatch(
				saveStateObjects({
					EXPANDEDADS: expandedAds,
				})
			);
		},
		[EXPANDEDADS, dispatch]
	);

	if (!session.userSignedIn || !profile || !ads) {
		return null;
	}

	return (
		<>
			{ads.map((advertise) => (
				<div className='user_advertise_box' id={`ad_${advertise.id}`} key={advertise.id}>
					<div>
						<span className='button' onClick={() => expand(advertise)}>
							{advertise.name} (viewed: {advertise.viewed})
						</span>
					</div>
					{EXPANDEDADS[advertise.id] !== undefined && (
						<div className='user_ad_detail'>
							<div className='devider'></div>
							<div>{AdInfo.safeHtml(advertise.description)}</div>
							<div className='devider'></div>
							<div>
								<span>{+advertise.is_free ? getLabel('c_free_offer') : advertise.price}</span>
							</div>
							<div className='devider'></div>
							<div>
								<span
									className='wide_button'
									onClick={() => {
										userPage(`edit-ad/${advertise.id}`);
									}}
								>
									{getLabel('c_edit_ad')}
								</span>
								<span
									className='wide_button'
									onClick={() => {
										deleteAd(advertise);
									}}
								>
									{getLabel('c_delete')}
								</span>
							</div>
						</div>
					)}
				</div>
			))}
		</>
	);
};

export default UserAdvertiseSnippets;
