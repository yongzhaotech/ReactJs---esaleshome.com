import React from 'react';
import { AdInfo } from '../common/ad-info';
import Dropdown from '../common/dropdown';
import type { Identifier } from '../types/common';
import type { Advertise } from '../types/ad';
import { useLocalizationContext } from '../context/localization-context';

interface Page {
	i: number;
	n: string | number;
}

interface PagesListProps {
	pages: Page[];
	searchAd: boolean;
	currentPage: Identifier;
	ads: Advertise[];
}

const PagesList = ({ pages, searchAd, currentPage, ads }: PagesListProps) => {
	const { getLocalizedLabel: getLabel } = useLocalizationContext();
	const functionRef = searchAd ? AdInfo.selectSearchPage : AdInfo.selectHomePage;
	const adsCount = ads.length;
	const currentPageObject = pages.find(page => +page.i === +currentPage);
	const currentPageName = currentPageObject ? currentPageObject.n : '';
	const title = `${getLabel('ad_page')} ${currentPageName}`;

	if (pages.length <= 1) {
		return adsCount ? (
			<div>
				{adsCount} {getLabel(adsCount === 1 ? 'ad_found' : 'ads_found')}
			</div>
		) : null;
	}

	return (
		<div className="page-dropdown">
			<Dropdown
				title={title}
				id="split-button-pull-left"
				options={pages
					.filter(page => +page.i !== +currentPage)
					.map(page => ({
						key: String(page.i),
						label: `${getLabel('jump_page')} ${page.n}`,
					}))}
				onSelect={key => {
					const page = pages.find(item => String(item.i) === key);
					if (page) {
						functionRef(+currentPage, page);
					}
				}}
			/>
			<div style={{ marginLeft: '5px' }}>
				{adsCount} {getLabel(adsCount === 1 ? 'ad_found' : 'ads_found')}
			</div>
		</div>
	);
};

export default PagesList;
