import React from 'react';
import Dropdown from '../common/dropdown';
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
			<Dropdown
				title={`${getLabel('sort_by')}: ${getLabel(menuData[sort])}`}
				id='split-button-pull-right'
				pullRight
				options={(Object.keys(menuData) as SortKey[])
					.filter((key) => key !== sort)
					.map((key) => ({ key, label: getLabel(menuData[key]) }))}
				onSelect={onSort}
			/>
		</div>
	);
};

export default SortAds;
