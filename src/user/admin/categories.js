import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdminFunction } from './admin-function';
import { Helper } from '../../common/js-funcs';
import { Engine } from '../../common/engine';

class Categories extends Component {
	render() {
		const {profile, categories, USERSIGNEDIN, POSTERRORS} = this.props;

        if(!USERSIGNEDIN || !profile || +profile.access_level < 2 || !categories.length) {
            return null;
        }

		let errors = Object.keys(POSTERRORS),
			hasError = errors.length > 0,
			error = hasError ? (
				<div className="site_config_error">
				{
					errors.map(k => (
						<span key={k}>{POSTERRORS[k]}</span>
					))
				}
				</div>			
			) : null,
			output = (
				<section>
					{error}
					<form name="add_category" action="/adb/save_category.pl">
						<div className="account_box_title">Create a New Category</div>
						<div>
							<div className="account_box_label">Category</div>
							<div className="account_box_field"><input type="text" name="new_category" maxLength="60" /></div>
							<div className="account_box_field"><input type="text" name="new_category_cn" maxLength="60" /></div>
						</div>
						<div className="account_box_label">
							{Helper.submitButton('c_submit', 'add_category', true)}
							<input type="hidden" name="frm_action" value="new_category" />
						</div>
					</form>
					<div className="devider"></div>
					<form name="edit_category" action="/adb/save_category.pl">
						<div>
							<div className="account_box_title">Change the category text</div>
							<div className="account_box_label">Select a category to change</div>
							<div className="account_box_field">
								<select name="category" onChange={() => {AdminFunction.loadToChange(document.forms['edit_category'], document.forms['edit_category']['category'], 'new_category', 'new_category_cn', 'edit_category_obj')}}>
									<option value=""></option>
									{
										categories.map(category => (
											<option value={category.id} key={category.id}>{category.name}::{category.name_cn}</option>
										))
									}
								</select>
							</div>
						</div>
						<div id="edit_category_obj" style={{display: 'none'}}>
							<div>
								<div className="account_box_label">Category</div>
								<div className="account_box_field"><input type="text" name="new_category" maxLength="60" /></div>
								<div className="account_box_field"><input type="text" name="new_category_cn" maxLength="60" /></div>
							</div>
							<div className="account_box_label">
								{Helper.submitButton('c_submit', 'edit_category', true)}
								<input type="hidden" name="frm_action" value="edit_category" />
							</div>
						</div>
					</form>
				</section>
			);

		return (
			<section>
				{output}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	POSTERRORS: state.POSTERRORS,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(Categories);