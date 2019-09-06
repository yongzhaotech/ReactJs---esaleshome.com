import React, { Component } from 'react';
import { getLabel } from '../../common/label';
import {UserFunction} from '../user-function';

class AdminTabs extends Component {
	render() {
        let {profile} = this.props;

        return profile && +profile.access_level > 1 ? (
			<section>
				<div className="block_spacer"></div>
				<span className='wide_button' onClick={() => {UserFunction.userPage('save-category')}}>{getLabel('c_category')}</span>
				<span className='wide_button' onClick={() => {UserFunction.userPage('save-subcategory')}}>{getLabel('c_sub_category')}</span>
				<span className='wide_button' onClick={() => {UserFunction.userPage('admin-perm')}}>{getLabel('c_permission')}</span>
				<span className='wide_button' onClick={() => {UserFunction.userPage('admin-ads')}}>{getLabel('c_advertise')}</span>
				<span className='wide_button' onClick={() => {UserFunction.userPage('visitor-hits')}}>{getLabel('c_hit')}</span>
				<span className='wide_button' onClick={() => {UserFunction.userPage('admin-users')}}>{getLabel('c_user')}</span>
				<span className='wide_button' onClick={() => {UserFunction.genStaticContent()}}>{getLabel('c_static_content')}</span>
				<span className='wide_button' onClick={() => {UserFunction.genStaticHtmls()}}>{getLabel('c_static_html')}</span>
			</section>
        ) : null;
	};
}

export default AdminTabs;
