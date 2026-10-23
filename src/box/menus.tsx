import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { StaticVars } from '../static/static-vars';
import { LangMessages } from '../static/langs';
import { useLocalizationContext, Label } from '../context/localization-context';
import { session, route } from '../utils';
import RootReducer from '../reducer';
import { useFunctions } from '../hook/js-function-hook';

type RootState = ReturnType<typeof RootReducer>;

const Menus = () => {
	const MENUS = useSelector((state: RootState) => state.MENUS);
	const { getLocalizedLabel } = useLocalizationContext();
	const { launchMenu, clearScreen } = useFunctions();

	const getMenuLabel = useCallback(
		(name: string) => {
			const label = name as Label;
			if (LangMessages[label] === undefined) {
				throw new Error(`Unknown menu label: ${label}`);
			}
			return getLocalizedLabel(label);
		},
		[getLocalizedLabel]
	);

	return (
		<div
			className='dp_menu'
			aria-expanded={MENUS}
		>
			{StaticVars.menus.map((menu) =>
				menu.b ? (
					<div key={menu.a} className='menu' onClick={() => launchMenu(menu.a)} role='menuitem'>
						{getMenuLabel(menu.n)}
					</div>
				) : menu.n === 'c_account' && !session.userSignedIn ? (
					<div key={menu.a} className='menu' onClick={() => launchMenu('login')} role='menuitem'>
						{getMenuLabel(menu.n)}
					</div>
				) : (
					<div
						key={menu.a}
						className='menu'
						onClick={() => {
							clearScreen();
							route.location(menu.a);
						}}
						role='menuitem'
					>
						{getMenuLabel(menu.n)}
					</div>
				)
			)}
		</div>
	);
};

export default Menus;
