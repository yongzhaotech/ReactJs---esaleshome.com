import React, { Component } from 'react';
import { UserFunction } from '../user-function';
import { AdminFunction } from './admin-function';
import { Engine } from '../../common/engine';
import { fetchUserData } from '../../action';

class SiteAds extends Component {
	render() {
		const {profile, ads, pages, currentPage, USERSIGNEDIN} = this.props;

        if(!USERSIGNEDIN || !profile || +profile.access_level < 2 || !ads.length) {
            return null;
        }

		let pagesList = pages.length ? (	
				<nav className="btn_list">
				{
					pages.map(page => { 
						let className = +currentPage === +page.i ? "page current_page" : "page";
						return (
							<div className={className} onClick={() => {Engine.dispatch(fetchUserData([{dataKey: 'siteAds', page}]))}} key={page.i}>
								{page.n}
							</div>
						)
					})
				}
				</nav>
			) : null,
			output = (
			<table style={{width: '100%'}} border='0' cellPadding='2' cellSpacing='2'>
				<tbody>
					<tr style={{fontWeight: 'bold'}}>
						<td>Ad Name</td>
						<td>Poster</td>
						<td>Email</td>
						<td>Phone</td>
						<td>Post Id</td>
						<td>Post Date</td>
						<td>Status</td>
						<td>Apply Change</td>
					</tr>
					{
						ads.map((ad, index) => (
							<tr className={`${UserFunction.oddRow(index) ? 'odd' : 'even'}`} key={ad.id}>
								<td>
                                    {ad.name}
								</td>
								<td>
                                    {ad.poster ? ad.poster : 'Unknown'}
								</td>
								<td>
                                    {ad.contact_email}
								</td>
								<td>
                                    {ad.contact_phone}
								</td>
								<td>
                                    {ad.post_id}
								</td>
								<td>
                                    {ad.create_time}
								</td>
								<td>
									<input type='text' name={`status_${index}`} defaultValue={+ad.active ? 'active' : 'inactive'} readOnly style={{width: '80px'}} />
									<input type='hidden' name={`id_${index}`} defaultValue={ad.id} />
								</td>
								<td>
									<input type='button' onClick={() => {AdminFunction.setStatus('set_advertise', ad, index, '1')}} value='activate' />
									<input type='button' onClick={() => {AdminFunction.setStatus('set_advertise', ad, index, '0')}} value='deactivate' />
									<input type='button' onClick={() => {AdminFunction.removeAd(ad)}} value='delete' />
								</td>
							</tr>
							)
						)
					}
				</tbody>
			</table>
		);

		return (
			<section>
				{pagesList}
				<div className='devider'></div>
				<form style={{margin: '0'}} name='set_advertise'>
				{output}
				</form>
			</section>
		);
	};
}

export default SiteAds;
