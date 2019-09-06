import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { AdInfo } from '../common/ad-info';
import { getLabel } from '../common/label';

class PagesList extends Component {
    render() {
        const {pages, searchAd, currentPage, ads} = this.props,
			functionRef = searchAd ? AdInfo.selectSearchPage : AdInfo.selectHomePage,
			adsCount = ads.length,
			currentPageObject = pages.find(page => +page.i === +currentPage),
			currentPageName = currentPageObject ? currentPageObject.n : '',
			title = `${getLabel('ad_page')} ${currentPageName}`;

        if(pages.length <= 1) {
            return adsCount ? (
				<div>
					{adsCount} {getLabel(adsCount === 1 ? 'ad_found' : 'ads_found')}
				</div>
			) : null;
        }

        return (
			<div className="page-dropdown">
				<DropdownButton bsSize='small' title={title} id="split-button-pull-left" noCaret>
					{
						pages.filter(page => +page.i !== +currentPage).map(page => (
							<MenuItem key={page.i} onSelect={() => functionRef(currentPage, page)}>
								{`${getLabel('jump_page')} ${page.n}`}
							</MenuItem>
						))
					}
				</DropdownButton>
				<div style={{marginLeft: '5px'}}>{adsCount} {getLabel(adsCount === 1 ? 'ad_found' : 'ads_found')}</div>
			</div>
        );
    };
}

export default PagesList;
