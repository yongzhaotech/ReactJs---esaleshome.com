import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../logo.svg';
import { getLabel } from '../common/label';

interface LoadingData {
	ISLOADINGDATA: boolean;
	HIDELOADINGTITLE: boolean;
}

interface LoadingProps {
	loadingData: LoadingData;
	loadingImagesMessage: string;
}

interface LoadingState {
	loadingData: LoadingData;
	loadingImagesMessage: string;
}

export class Loading extends Component<LoadingProps> {
	render() {
		const { loadingData, loadingImagesMessage } = this.props;

		if (!loadingData.ISLOADINGDATA) {
			return null;
		}

		const className = loadingData.HIDELOADINGTITLE ? 'transparent' : 'load_message';

		return (
			<section className="loading">
				<div className={className}>
					<div>
						{loadingData.HIDELOADINGTITLE ? null : (
							<React.Fragment>
								<div>{getLabel('loading_data')}</div>
								<div className="devider"></div>
							</React.Fragment>
						)}
					</div>
					{loadingImagesMessage ? (
						<div>{getLabel('loading_large_image')}: {loadingImagesMessage}</div>
					) : null}
					<img className="rotate-on" alt="" src={logo} height="65" />
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state: LoadingState): LoadingProps => ({
	loadingData: state.loadingData,
	loadingImagesMessage: state.loadingImagesMessage
});

export default connect(mapStateToProps)(Loading);
