import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvertiseContact from './advertise-contact';
import ContactUs from './contact-us';
import EmailFriendBox from './email-friend-box';
import FindVisitorAdBox from './find-visitor-ad-box';
import ForgetPasswordBox from './forget-password-box';
import LoginBox from './login-box';
import Register from './register';
import SearchBox from './search-box';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';
import { AdInfo } from '../common/ad-info';
import { useLocalizedLabel } from '../common/use-localized-label';
import { switchLanguage, keyWordSearch } from '../action';
import RootReducer from '../reducer';

type RootState = ReturnType<typeof RootReducer>;

const ActionBox = () => {
	const boxState = useSelector((state: RootState) => state.BOXES);
	const boxes = {
		box: typeof boxState.box === 'string' ? boxState.box : '',
		name: typeof boxState.name === 'string' ? boxState.name : undefined,
		id: typeof boxState.id === 'string' || typeof boxState.id === 'number' ? boxState.id : undefined,
	};
	const menusOpen = useSelector((state: RootState) => state.MENUS);
	const dispatch = useDispatch();
	const getLocalizedLabel = useLocalizedLabel();

	useEffect(() => {
		Engine.registerMenuItems();
	}, []);

	const goHome = () => {
		AdInfo.listAdvertise();
		Helper.location('');
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
				<div className='ad_action_box_wrapper'>
					<AdvertiseContact />
					<ContactUs />
					<EmailFriendBox />
					{Engine.component(FindVisitorAdBox, { BOXES: boxes })}
					<ForgetPasswordBox />
					{Engine.component(LoginBox, { BOXES: boxes })}
					{Engine.component(Register, { BOXES: boxes })}
					{Engine.component(SearchBox, { BOXES: boxes })}
				</div>
			</nav>
		</nav>
	);
};

export default ActionBox;
