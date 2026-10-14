import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdminFunction } from './admin-function';
import { Helper } from '../../common/js-funcs';
import { Engine } from '../../common/engine';

export interface SubCategoryOption {
	id: string | number;
	name: string;
	name_cn: string;
}

interface AdminCategoryItem {
	i: string | number;
	n: string;
	n_cn: string;
}

export interface SubCategoriesData {
	categories: SubCategoryOption[];
	items: Record<string, SubCategoryOption[]>;
	default_category_id: string | number;
	category_list: Record<string, Record<string, AdminCategoryItem[]>>;
}

interface SubCategoriesProps {
	USERSIGNEDIN: boolean;
	profile?: {
		access_level?: string | number;
	};
	subCategories?: SubCategoriesData;
	POSTERRORS: Record<string, string>;
}

interface SubCategoriesState {
	POSTERRORS: Record<string, string>;
}

class SubCategories extends Component<SubCategoriesProps> {
	render() {
		const {profile, subCategories, USERSIGNEDIN, POSTERRORS} = this.props;

        if(!USERSIGNEDIN || !profile || Number(profile.access_level) < 2 || !subCategories) {
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
							<div className="account_box_field"><input type="text" name="sub_category" maxLength={60} /></div>
							<div className="account_box_field"><input type="text" name="sub_category_cn" maxLength={60} /></div>
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
								<select name="category" onChange={() => {
									const form = document.forms.namedItem('edit_subcategory');
									const category = form && form.elements.namedItem('category');
									const subCategory = form && form.elements.namedItem('new_subcategory');
									const subCategoryCn = form && form.elements.namedItem('new_subcategory_cn');
									if (form && category instanceof HTMLSelectElement && subCategory instanceof HTMLInputElement && subCategoryCn instanceof HTMLInputElement) {
										AdminFunction.admLoadDataItem(form, category, 'item', subCategory, subCategoryCn);
									}
								}}>
								{
									subCategories.categories.map(category => (
										<option value={category.id} key={category.id}>{category.name}::{category.name_cn}</option>
									))
								}
								</select>
							</div>
							<div className="account_box_label">Sub category to change</div>
							<div className="account_box_field">
								<select name="item" onChange={() => {
									const form = document.forms.namedItem('edit_subcategory');
									const item = form && form.elements.namedItem('item');
									if (form && item instanceof HTMLSelectElement) {
										AdminFunction.loadToChange(form, item, 'new_subcategory', 'new_subcategory_cn', 'edit_subcategory_obj');
									}
								}}>
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
								<div className="account_box_field"><input type="text" name="new_subcategory" maxLength={60} /></div>
								<div className="account_box_field"><input type="text" name="new_subcategory_cn" maxLength={60} /></div>
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

const mapStateToProps = (state: SubCategoriesState) => ({
	POSTERRORS: state.POSTERRORS,
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(SubCategories);