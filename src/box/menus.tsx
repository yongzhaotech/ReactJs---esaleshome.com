import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StaticVars } from '../static/static-vars';
import { LangMessages } from '../static/langs';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';

type MenuLabel = Parameters<typeof getLabel>[0];

const isMenuLabel = (label: string): label is MenuLabel => label in LangMessages;

const getMenuLabel = (label: string): string => {
	if (!isMenuLabel(label)) {
		throw new Error(`Unknown menu label: ${label}`);
	}

	return getLabel(label);
};

interface MenusProps {
	USERSIGNEDIN: boolean;
	MENUS: boolean;
}

interface MenusState {
	language: string;
	MENUS: boolean;
}

class Menus extends Component<MenusProps> {
	private menuBoxReference: HTMLDivElement | null = null;

	private createReference = (element: HTMLDivElement | null): void => {
		this.menuBoxReference = element;
		Helper.setMenuBoxReference(element);
	};

	render() {
		const { USERSIGNEDIN, MENUS } = this.props;

		return (
			<div
				className="dp_menu"
				ref={this.createReference}
				aria-expanded={MENUS}
				onBlur={Engine.dropMenuBlur}
				onFocus={Engine.dropMenuFocus}
			>
				{StaticVars.menus.map(menu => (
					menu.b ? (
						<div key={menu.a} className="menu" onClick={() => Helper.launchMenu(menu.a)} role="menuitem">
							{getMenuLabel(menu.n)}
						</div>
					) : menu.n === 'c_account' && !USERSIGNEDIN ? (
						<div key={menu.a} className="menu" onClick={() => Helper.launchMenu('login')} role="menuitem">
							{getMenuLabel(menu.n)}
						</div>
					) : (
						<div key={menu.a} className="menu" onClick={() => { Helper.clearScreen(); Helper.location(menu.a); }} role="menuitem">
							{getMenuLabel(menu.n)}
						</div>
					)
				))}
			</div>
		);
	}
}

const mapStateToProps = (state: MenusState): MenusProps => ({
	USERSIGNEDIN: Engine.userSignedIn(),
	MENUS: state.MENUS
});

export default connect(mapStateToProps)(Menus);
