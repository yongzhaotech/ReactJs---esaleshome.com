import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StaticVars } from '../static/static-vars';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';
import { Engine } from '../common/engine';

let Menus = class extends Component {
    constructor(props) {
        super(props);
        this.menuBoxReference = null;

        this.createReference = element => {
            this.menuBoxReference = element;
			Helper.setMenuBoxReference(this.menuBoxReference);
        }
    }

 	render() {
		return (
			<div className="dp_menu" ref = {this.createReference} aria-expanded={this.props.MENUS} onBlur={Engine.dropMenuBlur} onFocus={Engine.dropMenuFocus}>
				{StaticVars.menus.map(m => (
					m.b ? (
							<div key={m.a} className="menu" onClick={() => Helper.launchMenu(m.a)} role="menuitem">
								{getLabel(m.n)}
							</div>
						) : (
								m.n === 'c_account' && !this.props.USERSIGNEDIN ? (
									<div key={m.a} className="menu" onClick={() => Helper.launchMenu('login')} role="menuitem">
										{getLabel(m.n)}
									</div>
								) : (
									<div key={m.a} className="menu" onClick={() => {Helper.clearScreen(); Helper.location(m.a)}} role="menuitem">
										{getLabel(m.n)}
									</div>
								)
						)
					)
				)}
			</div>
		);
	};
};

const mapStateToProps = state => ({
	LANGUAGE: state.language,
	USERSIGNEDIN: Engine.userSignedIn(),
	MENUS: state.MENUS
});

export default connect(
	mapStateToProps
)(Menus);
