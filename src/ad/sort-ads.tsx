import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { useLocalizationContext } from '../context/localization-context';

const menuData = {
	'create_date,asc': 'sort_date_AZ',
	'create_date,des': 'sort_date_ZA',
	'price,asc': 'sort_price_09',
	'price,des': 'sort_price_90',
} as const;

type SortKey = keyof typeof menuData;

interface SortAdsProps {
	onSort: (eventKey: SortKey) => void;
	sort: SortKey;
}

const SortAds = ({ onSort, sort }: SortAdsProps) => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	return (
		<div className='sort-dropdown'>
			<DropdownButton
				bsSize='small'
				title={`${getLabel('sort_by')}: ${getLabel(menuData[sort])}`}
				pullRight
				id='split-button-pull-right'
				noCaret
			>
				{(Object.keys(menuData) as SortKey[])
					.filter((key) => key !== sort)
					.map((key) => (
						<MenuItem eventKey={key} key={key} onSelect={() => onSort(key)}>
							{getLabel(menuData[key])}
						</MenuItem>
					))}
			</DropdownButton>
		</div>
	);
};

export default SortAds;
