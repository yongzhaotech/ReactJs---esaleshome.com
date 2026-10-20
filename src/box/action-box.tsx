import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import { AdInfo } from '../common/ad-info';
import { useLocalizedLabel } from '../hook/localization-hook';
import { switchLanguage, keyWordSearch } from '../action';
import RootReducer from '../reducer';
import { Boxes } from './boxes';

type RootState = ReturnType<typeof RootReducer>;

const ActionBox = () => {
	const boxState = useSelector((state: RootState) => state.BOXES);
	const box = typeof boxState.box === 'string' ? boxState.box : '';
	const Box = Boxes[box];
	const menusOpen = useSelector((state: RootState) => state.MENUS);
	const dispatch = useDispatch();
	const getLocalizedLabel = useLocalizedLabel();

	useEffect(() => {
		Engine.registerMenuItems();
	}, []);

	const goHome = () => {
		AdInfo.listAdvertise();
		Engine.location('');
	};

	return (
		<nav id='ad_title_bar'>
			<nav className='btn_list'>
				<div
					id='menu_launcher'
					className={`nav_btn ${menusOpen ? 'menu_title_active' : ''}`}
					aria-haspopup='true'
					onClick={Helper.setDropDownMenus}
				>
					{getLocalizedLabel('c_menu')}
				</div>
				<div className='nav_btn' onClick={goHome}>
					{getLocalizedLabel('c_home')}
				</div>
				<div className='nav_btn' onClick={() => dispatch(switchLanguage())}>
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
