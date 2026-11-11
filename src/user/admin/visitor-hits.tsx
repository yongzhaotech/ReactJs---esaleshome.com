import React from 'react';
import { useDispatch } from 'react-redux';
import { UserFunction } from '../user-function';
import { AdminFunction } from './admin-function';
import { fetchUserData } from '../../action';

interface VisitorHit {
	ip: string;
	create_time: string;
	count: number;
}

interface VisitorHitsPage {
	i: string | number;
	n: string;
}

interface VisitorHitsProps {
	USERSIGNEDIN: boolean;
	profile?: { access_level?: string | number };
	hits: VisitorHit[];
	pages: VisitorHitsPage[];
	currentPage: string | number;
}

const VisitorHits = ({ profile, hits, pages, currentPage, USERSIGNEDIN }: VisitorHitsProps) => {
	const dispatch = useDispatch();
	const cellStyle: React.CSSProperties = { border: '1px solid #eccccc' };

	if (!USERSIGNEDIN || !profile || Number(profile.access_level) < 2 || !hits.length) {
		return null;
	}

	const pagesList = pages.length ? (
		<nav className="btn_list">
			{pages.map(page => {
				const className = +currentPage === +page.i ? 'page current_page' : 'page';
				return (
					<div className={className} onClick={() => {
						AdminFunction.clearHits();
						dispatch(fetchUserData([{ dataKey: 'visitorHits', page }]));
					}} key={page.i}>
						{page.n}
					</div>
				);
			})}
		</nav>
	) : null;

	return (
		<section>
			{pagesList}
			<div className="devider"></div>
			<form style={{ margin: '0' }} name="admin_visitor_hits">
				<table id="admin_visitor_hits" width="100%" className="alert" cellSpacing="2" cellPadding="2" style={{ border: '#eccccc 1px solid', borderRight: '#eccccc 1px solid', borderTop: '#eccccc 1px solid', background: 'none transparent scroll repeat 0% 0%', borderLeft: '#eccccc 1px solid', borderBottom: '#eccccc 1px solid', borderCollapse: 'collapse' }}>
					<tbody>
						<tr style={{ fontWeight: 'bold' }}>
							<td className="title" style={cellStyle}>ip address</td>
							<td className="title" style={cellStyle}>last visited</td>
							<td className="title" style={cellStyle}>times</td>
						</tr>
						{hits.map((hit, index) => (
							<tr className={UserFunction.oddRow(index) ? 'odd' : 'even'} key={hit.ip} id={`ip_${hit.ip}`}>
								<td style={cellStyle}><span className="button" onClick={() => AdminFunction.hitDetails(hit.ip)}>{hit.ip}</span></td>
								<td style={cellStyle}>{hit.create_time}</td>
								<td style={cellStyle}>{hit.count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</form>
		</section>
	);
};

export default VisitorHits;
