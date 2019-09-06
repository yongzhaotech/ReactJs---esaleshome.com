import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserFunction } from "../user-function";
import { Engine } from '../../common/engine';

const SiteUsers = class extends Component {
	render() {
		const {profile, users} = this.props;

        if(!this.props.USERSIGNEDIN || !profile || +profile.access_level < 2 || !users.length) {
            return null;
        }
	
		let output = (
			<table style={{width: '100%'}} border="0" cellPadding="2" cellSpacing="2">
				<tbody>
					<tr style={{fontWeight: 'bold'}}>
						<td>email</td>
						<td>last name</td>
						<td>first name</td>
						<td>created</td>
						<td>edited</td>
						<td>sign ins</td>
					</tr>
					{
						users.map((user, index) => (
							<tr className={`${UserFunction.oddRow(index) ? 'odd' : 'even'}`} key={user.email}>
								<td>{user.email}</td>
								<td>{user.last_name}</td>
								<td>{user.first_name}</td>
								<td>{user.create_time}</td>
								<td>{user.edit_time}</td>
								<td>{user.signin_count}</td>
							</tr>
							)
						)
					}
				</tbody>
			</table>
		);

		return (
			<section>
				<div className="devider"></div>
				{output}
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(SiteUsers);