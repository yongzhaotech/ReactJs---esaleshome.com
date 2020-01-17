import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAdvertises } from '../action';
import { Engine } from '../common/engine';
import SearchTerms from './search-terms';
import PagesList from './pages-list'
import AdvertiseSnippets from './advertise-snippets';
import SortAds from './sort-ads';
import ReactLoader from './react-loader';

/**
 * @description shared by search and list screens
 * before page mounts checkResultSets is called once, when page re-mounts checkResultSets is called once too
 * re-mounts happens when the user clicks on the 'Home' button or search returns a result set
 */
export class AdvertiseList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sorting: 'create_date,des'
		};
	};

	componentDidMount() {
		if (!this.props.performSearch) {
			Engine.dispatch(fetchAdvertises());
		}
	};

	sortAds = eventKey => {
		this.setState({
			sorting: eventKey
		});
	};

	applySorting = (a, b) => {
		if (!this.state.sorting) {
			return 0;
		}
		const [by, type] = this.state.sorting.split(','),
			[A, B] = [a[by], b[by]];
		if (type === 'asc') {
			if (A < B) {
				return -1;
			}
			if (A > B) {
				return 1;
			}
			return 0;
		} else if (type === 'des') {
			if (A < B) {
				return 1;
			}
			if (A > B) {
				return -1;
			}
			return 0;
		}
	};

	render() {
		let resultSets = this.props.resultSets || {},
			pages = resultSets.pages || [],
			currentPage = resultSets.currentPage || 0,
			searchAd = resultSets.searchAd || false,
			ads = (resultSets.ads || []).sort(this.applySorting);

		return (ads.length && (
			<React.Fragment>
				{Engine.component(SearchTerms)}
				<div className="page-list">
					{Engine.component(PagesList, { pages, searchAd, currentPage, ads })}
					{
						ads.length > 1 ? (<SortAds onSort={this.sortAds} sort={this.state.sorting} />) : null
					}
				</div>
				{Engine.component(AdvertiseSnippets, { ads, pageTitle: this.pageTitle })}
			</React.Fragment>
		)) || (<ReactLoader />);
	};
};

const mapStateToProps = state => ({
	resultSets: state.advertiseList.resultSets,
	performSearch: state.performSearch,
	LANGUAGE: state.language
});

export default connect(
	mapStateToProps
)(AdvertiseList);

AdvertiseList.propTypes = {
	resultSets: PropTypes.shape({
		pages: PropTypes.arrayOf(PropTypes.object),
		currentPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		searchAd: PropTypes.bool,
		ads: PropTypes.arrayOf(PropTypes.object)
	})
};