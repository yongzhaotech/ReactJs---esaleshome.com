import React, { Component } from 'react';
import { UserFunction } from '../user-function';
import { AdminFunction } from './admin-function';

class Permission extends Component {
    render() {
        const {profile, files, USERSIGNEDIN} = this.props;

        if(!USERSIGNEDIN || !profile || +profile.access_level < 2 || !files.length) {
            return null;
        }

		console.log(files);
		
        let output = (
			<table style={{width: '100%'}} border='0' cellPadding='2' cellSpacing='2'>
				<tbody>
				<tr style={{fontWeight: 'bold'}}>
					<td>Page Name</td>
					<td>Access Level</td>
					<td>Check Ad</td>
					<td>Permission Set</td>
					<td>Apply Change</td>
				</tr>
                {
                    files.map((file, index) => (
							<tr className={`${UserFunction.oddRow(index) ? 'odd' : 'even'}`} key={index}>
								<td>
									<input type='text' name={`page_${index}`} defaultValue={file.page} style={{width: '250px'}} readOnly />
								</td>
								<td>
									<input type='text' name={`access_level_${index}`} defaultValue={file.access_level} style={{width: '35px'}} readOnly />
								</td>
								<td>
									<input type='text' name={`check_ad_${index}`} defaultValue={file.check_ad} style={{width: '35px'}} readOnly />
								</td>
								<td>
									<span className='wide_button' onClick={() => {AdminFunction.accessLevel('set_permission', index, '0')}}>everyone</span>
									<span className='wide_button' onClick={() => {AdminFunction.accessLevel('set_permission', index, '1')}}>user</span>
									<span className='wide_button' onClick={() => {AdminFunction.accessLevel('set_permission', index, '2')}}>admin</span>
									<span>check ad:</span>
									<span className='wide_button' onClick={() => {AdminFunction.checkAd('set_permission', index, '1')}}>yes</span>
									<span className='wide_button' onClick={() => {AdminFunction.checkAd('set_permission', index, '0')}}>no</span>
								</td>
								<td>
									<input type='button' onClick={() => {AdminFunction.applyPermissionSetting('set_permission', index)}} value='apply change' />
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
				<div className='devider'></div>
				<form style={{margin: '0'}} name='set_permission'>
                    {output}
				</form>
			</section>
        );
    };
}

export default Permission;
