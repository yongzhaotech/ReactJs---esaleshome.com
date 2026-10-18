import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../logo.svg';
import RootReducer from '../reducer';
import { useLocalizedLabel } from '../hook/localization-hook';

type RootState = ReturnType<typeof RootReducer>;

const Loading = () => {
	const loadingData = useSelector((state: RootState) => state.loadingData);
	const loadingImagesMessage = useSelector((state: RootState) => state.loadingImagesMessage);
	const getLocalizedLabel = useLocalizedLabel();

	if (!loadingData.ISLOADINGDATA) {
		return null;
	}

	const className = loadingData.HIDELOADINGTITLE ? 'transparent' : 'load_message';

	return (
		<section className='loading'>
			<div className={className}>
				<div>
					{loadingData.HIDELOADINGTITLE ? null : (
						<>
							<div>{getLocalizedLabel('loading_data')}</div>
							<div className='devider'></div>
						</>
					)}
				</div>
				{loadingImagesMessage ? (
					<div>
						{getLocalizedLabel('loading_large_image')}: {loadingImagesMessage}
					</div>
				) : null}
				<img className='rotate-on' alt='' src={logo} height='65' />
			</div>
		</section>
	);
};

export default Loading;
