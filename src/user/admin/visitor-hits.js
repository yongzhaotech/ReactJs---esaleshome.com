import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserFunction } from '../user-function';
import { AdminFunction } from './admin-function';
import { Engine } from '../../common/engine';
import { fetchUserData } from '../../action';

const VisitorHits = class extends Component {
	render() {
		const {profile, hits, pages, currentPage} = this.props;

        if(!this.props.USERSIGNEDIN || !profile || +profile.access_level < 2 || !hits.length) {
            return null;
        }

		let pagesList = pages.length ? (	
				<nav className="btn_list">
				{
					pages.map(page => { 
						let className = +currentPage === +page.i ? "page current_page" : "page";
						return (
							<div className={className} onClick={() => {AdminFunction.clearHits(); Engine.dispatch(fetchUserData([{dataKey: 'visitorHits', page}]))}} key={page.i}>
								{page.n}
							</div>
						)
					})
				}
				</nav>
			) : null,
			output = (
				<table id="admin_visitor_hits" width="100%" className="alert" border="1" bordercolor="#eccccc" rules="all" cellSpacing="2" cellPadding="2" style={{borderRight: "#eccccc 1px solid", borderTop: "#eccccc 1px solid", background: "none transparent scroll repeat 0% 0%", borderLeft: "#eccccc 1px solid", borderBottom: "#eccccc 1px solid", borderCollapse: "collapse"}}>
				<tbody>
					<tr style={{fontWeight: 'bold'}}>
						<td className="title">ip address</td>
						<td className="title">last visited</td>
						<td className="title">times</td>
					</tr>
					{
						hits.map((hit, index) => (
							<tr className={`${UserFunction.oddRow(index) ? 'odd' : 'even'}`} key={hit.ip} id={`ip_${hit.ip}`}>
								<td><span className="button" onClick={() => {AdminFunction.hitDetails(hit.ip)}}>{hit.ip}</span></td>
								<td>{hit.create_time}</td>
								<td>{hit.count}</td>
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
				<form style={{margin: '0'}} name='admin_visitor_hits'>
					{output}
				</form>
			</section>
		);
	};
};

const mapStateToProps = state => ({
	USERSIGNEDIN: Engine.userSignedIn()
});

export default connect(
	mapStateToProps
)(VisitorHits);