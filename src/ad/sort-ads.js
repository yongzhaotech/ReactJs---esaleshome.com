import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { getLabel } from '../common/label';

export default ({onSort, sort}) => {
	const menuData = {
		'create_date,asc': 'sort_date_AZ',
		'create_date,des': 'sort_date_ZA',
		'price,asc': 'sort_price_09',
		'price,des': 'sort_price_90'
	};
	return (
		<div className="sort-dropdown">
			<DropdownButton bsSize='small' title={`${getLabel('sort_by')}: ${getLabel(menuData[sort])}`} pullRight id="split-button-pull-right" noCaret>
				{
					Object.keys(menuData).filter(key => key !== sort).map(key => (
						<MenuItem eventKey={key} key={key} onSelect={onSort}>
							{getLabel(menuData[key])}
						</MenuItem>
					))
				}
			</DropdownButton>
		</div>
	);
};