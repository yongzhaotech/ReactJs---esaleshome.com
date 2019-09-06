import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from '../logo.svg';
import { getLabel } from '../common/label';

export class Loading extends Component {
	render() {
		if(!this.props.loadingData.ISLOADINGDATA) {
			return null;
		}

		const [className, title] = this.props.loadingData.HIDELOADINGTITLE ? ['transparent', null] : ['load_message', (
				<React.Fragment>
					<div>{getLabel('loading_data')}</div><div className='devider'></div>
				</React.Fragment>
			)]; 
		
		return (
			<section className="loading">
				<div className={`${className}`}>
					<div>{title}</div>
					{
						this.props.loadingImagesMessage ? (
							<div>{getLabel('loading_large_image')}: {this.props.loadingImagesMessage}</div>
						) : null
					}
					<img className="rotate-on" alt="" src={logo} height="65" />
				</div>
			</section>
		);
	};
};

const mapStateToProps = state => ({
	loadingData: state.loadingData,
	loadingImagesMessage: state.loadingImagesMessage
});

export default connect(
	mapStateToProps
)(Loading);

Loading.propTypes = {
	loadingData: PropTypes.shape({
		ISLOADINGDATA: PropTypes.any
	})
};