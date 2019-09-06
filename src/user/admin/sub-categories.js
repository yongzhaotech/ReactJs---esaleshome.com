import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdminFunction } from './admin-function';
import { Helper } from '../../common/js-funcs';
import { Engine } from '../../common/engine';

class SubCategories extends Component {
	render() {
		const {profile, subCategories, USERSIGNEDIN, POSTERRORS} = this.props;

        if(!USERSIGNEDIN || !profile || +profile.access_level < 2 || !Object.keys(subCategories).length) {
            return null;
        }

		AdminFunction.setAdmPageVars(subCategories.category_list);
		
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
					<form name="add_subcategory" action="/adb/save_subcategory.pl">
						<div className="account_box_title">New Sub Category</div>
						<div>
							<div className="account_box_label">Choose a category</div>
							<div className="account_box_field">
								<select name="category">
								{
									subCategories.categories.map(category => (
										<option value={category.id} key={category.id}>{category.name}::{category.name_cn}</option>
									))
								}
								</select>
							</div>
						</div>
						<div>
							<div className="account_box_label">Sub Category</div>
							<div className="account_box_field"><input type="text" name="sub_category" maxLength="60" /></div>
							<div className="account_box_field"><input type="text" name="sub_category_cn" maxLength="60" /></div>
						</div>
						<div className="account_box_label">
							{Helper.submitButton('c_submit', 'add_subcategory', true)}
							<input type="hidden" name="frm_action" value="new_subcategory" />
						</div>
					</form>
					<div className="devider"></div>
					<form name="edit_subcategory" action="/adb/save_subcategory.pl">
						<div>
							<div className="account_box_title">Change sub category text</div>
							<div className="account_box_label">Select a category</div>
							<div className="account_box_field">
								<select name="category" onChange={() => {AdminFunction.admLoadDataItem(document.forms['edit_subcategory'], document.forms['edit_subcategory']['category'], 'item', document.forms['edit_subcategory']['new_subcategory'], document.forms['edit_subcategory']['new_subcategory_cn'])}}>
								{
									subCategories.categories.map(category => (
										<option value={category.id} key={category.id}>{category.name}::{category.name_cn}</option>
									))
								}
								</select>
							</div>
							<div className="account_box_label">Sub category to change</div>
							<div className="account_box_field">
								<select name="item" onChange={() => {AdminFunction.loadToChange(document.forms['edit_subcategory'], document.forms['edit_subcategory']['item'], 'new_subcategory', 'new_subcategory_cn', 'edit_subcategory_obj')}}>
									{
										subCategories.items[subCategories.default_category_id].map(item => (
											<option value={item.id} key={item.id}>{item.name}::{item.name_cn}</option>
										))
									}
								</select>
							</div>
						</div>
						<div id="edit_subcategory_obj" style={{display: 'none'}}>
							<div>
								<div className="account_box_label">Sub category</div>
								<div className="account_box_field"><input type="text" name="new_subcategory" maxLength="60" /></div>
								<div className="account_box_field"><input type="text" name="new_subcategory_cn" maxLength="60" /></div>
							</div>
							<div className="account_box_label">
								{Helper.submitButton('c_submit', 'edit_subcategory', true)}
								<input type="hidden" name="frm_action" value="edit_subcategory" />
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
)(SubCategories);