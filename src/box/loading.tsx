import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../logo.svg';
import RootReducer from '../reducer';
import { LangMessages } from '../static/langs';
import type { Language } from '../static/langs';

type RootState = ReturnType<typeof RootReducer>;
const labels = LangMessages as Record<string, Record<Language, string>>;

const Loading = () => {
	const loadingData = useSelector((state: RootState) => state.loadingData);
	const loadingImagesMessage = useSelector((state: RootState) => state.loadingImagesMessage);
	const language = useSelector((state: RootState): Language => (state.language === 'cn' ? 'cn' : 'en'));

	if (!loadingData.ISLOADINGDATA) {
		return null;
	}

	const className = loadingData.HIDELOADINGTITLE ? 'transparent' : 'load_message';

	return (
		<section className='loading'>
			<div className={className}>
				<div>
					{loadingData.HIDELOADINGTITLE ? null : (
						<React.Fragment>
							<div>{labels.loading_data[language]}</div>
							<div className='devider'></div>
						</React.Fragment>
					)}
				</div>
				{loadingImagesMessage ? (
					<div>
						{labels.loading_large_image[language]}: {loadingImagesMessage}
					</div>
				) : null}
				<img className='rotate-on' alt='' src={logo} height='65' />
			</div>
		</section>
	);
};

export default Loading;
