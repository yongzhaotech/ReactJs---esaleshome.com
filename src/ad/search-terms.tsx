import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import { selectSearchTerm } from '../action';

interface SearchTerm {
	[key: string]: unknown;
	key: string;
	text: Record<'en' | 'cn', string>;
}

interface SearchTermsProps {
	searchTerms: SearchTerm[];
	LANGUAGE: 'en' | 'cn';
}

interface SearchTermsState {
	searchTerms: SearchTerm[];
	language: 'en' | 'cn';
}

class SearchTerms extends Component<SearchTermsProps> {
	render() {
		const { searchTerms, LANGUAGE } = this.props;

		if (!searchTerms.length) {
			Helper.title();
			return null;
		}

		Helper.title(searchTerms.map(term => term.text[LANGUAGE]).join(' - '));

		return (
			<div className="ad_nav_bar">
				{searchTerms.map((term, index) => {
					const isCurrentTerm = index === searchTerms.length - 1;

					return (
						<span key={term.key}>
							{index > 0 ? <span style={{ margin: '0px 2px', fontStyle: 'oblique' }}>/</span> : null}
							{isCurrentTerm ? (
								<span>{term.text[LANGUAGE]}</span>
							) : (
								<button type="button" className="action-button" onClick={() => Engine.dispatch(selectSearchTerm(term))}>
									{term.text[LANGUAGE]}
								</button>
							)}
						</span>
					);
				})}
			</div>
		);
	}
}

const mapStateToProps = (state: SearchTermsState) => ({
	searchTerms: state.searchTerms,
	LANGUAGE: state.language
});

export default connect(mapStateToProps)(SearchTerms);
