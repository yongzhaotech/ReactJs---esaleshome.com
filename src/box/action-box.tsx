import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Engine } from '../common/engine';
import { AdInfo } from '../common/ad-info';
import { useLocalizationContext } from '../context/localization-context';
import { keyWordSearch } from '../action';
import RootReducer from '../reducer';
import { Boxes } from './boxes';
import { route } from '../utils';
import { useFunctions } from '../hook/js-function-hook';

type RootState = ReturnType<typeof RootReducer>;

const ActionBox = () => {
	const boxState = useSelector((state: RootState) => state.BOXES);
	const box = typeof boxState.box === 'string' ? boxState.box : '';
	const Box = Boxes[box];
	const menusOpen = useSelector((state: RootState) => state.MENUS);
	const dispatch = useDispatch();
	const { toggleLang, getLocalizedLabel } = useLocalizationContext();
	const { openMenu } = useFunctions();

	useEffect(() => {
		Engine.registerMenuItems();
	}, []);

	const goHome = () => {
		AdInfo.listAdvertise();
		route.location('');
	};

	return (
		<nav id='ad_title_bar'>
			<nav className='btn_list'>
				<div
					id='menu_launcher'
					className={`nav_btn ${menusOpen ? 'menu_title_active' : ''}`}
					aria-haspopup='true'
					onClick={openMenu}
				>
					{getLocalizedLabel('c_menu')}
				</div>
				<div className='nav_btn' onClick={goHome}>
					{getLocalizedLabel('c_home')}
				</div>
				<div className='nav_btn' onClick={toggleLang}>
					{getLocalizedLabel('c_language')}
				</div>
				<label htmlFor='keyWordSearch' className='visually-hidden'>
					{getLocalizedLabel('c_key_search')}
				</label>
				<input
					name='keyWordSearch'
					id='keyWordSearch'
					className='key-word-search'
					placeholder={getLocalizedLabel('c_key_search')}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						dispatch(keyWordSearch(event.target.value))
					}
				/>
				{Box && (
					<div className='ad_action_box_wrapper'>
						<Box />
					</div>
				)}
			</nav>
		</nav>
	);
};

export default ActionBox;
