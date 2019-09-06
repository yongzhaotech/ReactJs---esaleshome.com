import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Engine } from '../common/engine';
import { Helper } from '../common/js-funcs';
import { selectSearchTerm } from '../action';

let SearchTerms = class extends Component {
    render() {
        let searchTerms = this.props.searchTerms,
			diff;

        if(!searchTerms.length) {
			Helper.title();
            return null;
        }

		Helper.title(searchTerms.map(term => term.text[this.props.LANGUAGE]).join(' - '));
		
        return (
			<div className="ad_nav_bar">
				{
                    searchTerms.map((term, index) => {
                        diff = searchTerms.length - 1 - index;
                    	return (
                    		<span key={term.key}>
								{index > 0 ? (<span style={{margin: '0px 2px', fontStyle: 'oblique'}}>/</span>) : null}
								<React.Fragment>
									{
										diff === 0 ?
											(<span>{term.text[this.props.LANGUAGE]}</span>) :
											(<a href="" onClick={e => {e.preventDefault(); Engine.dispatch(selectSearchTerm(term))}}>{term.text[this.props.LANGUAGE]}</a>)
									}
								</React.Fragment>
							</span>
						)
					})
				}
			</div>
        );
    };
};

const mapStateToProps = state => ({
	searchTerms: state.searchTerms,
	LANGUAGE: state.language
});

SearchTerms = connect(
	mapStateToProps
)(SearchTerms);

export default SearchTerms;
