import React from 'react';
import { useSelector } from 'react-redux';
import { AdFuncs } from '../common/ad-funcs';
import { smallImageSrc } from '../common/config';
import { Helper } from '../common/js-funcs';
import RootReducer from '../reducer';
import { useLocalizationContext } from '../context/localization-context';

type RootState = ReturnType<typeof RootReducer>;

const ImageList = () => {
	const models = useSelector((state: RootState) => state.MODELS);
	const { getLocalizedLabel } = useLocalizationContext();
	const numbers: number[] = Array.isArray(models.images)
		? models.images.filter((count): count is number => typeof count === 'number')
		: [];
	const adImages = models.adImages && typeof models.adImages === 'object' ? models.adImages : {};
	const mainPictureId =
		typeof models.mainPictureId === 'number' || typeof models.mainPictureId === 'string'
			? models.mainPictureId
			: '';
	const imageErrorNumber = Number(models.imageErrorNumber);
	const imageErrorCode = typeof models.imageErrorCode === 'string' ? models.imageErrorCode : undefined;
	const previews = numbers.map((count) => {
		const imageFound = count in adImages;
		const imageSelected = AdFuncs.imageSelected(count);

		return imageFound || imageSelected ? (
			<div key={count} className='img_wrapper'>
				{imageFound ? (
					<img
						className='img_selected'
						src={`${smallImageSrc}${count}.jpg`}
						style={{ verticalAlign: 'top' }}
						alt=''
					/>
				) : null}
				{imageSelected ? (
					<img
						className='img_selected box-in'
						src={AdFuncs.imageSource(count)}
						style={{ verticalAlign: 'top' }}
						alt=''
					/>
				) : null}
			</div>
		) : null;
	});
	const images = numbers.map((count) => {
		const imageSelected = AdFuncs.imageSelected(count);
		const imageFound = count in adImages;

		return (
			<div
				key={count}
				className={`image_line ${imageSelected ? 'image_selected' : ''} ${
					imageErrorNumber === count ? 'image_error' : ''
				}`}
			>
				<nav className='btn_list'>
					<div
						className={`tab ${mainPictureId === count ? 'active' : ''}`}
						onClick={() => AdFuncs.setMainPicture(count)}
					>
						{getLocalizedLabel('p_main')}
					</div>
					<div className='tab' onClick={() => AdFuncs.rmAdImage(count)}>
						{getLocalizedLabel('p_delete')}
					</div>
					{imageFound ? (
						<div className='tab inactive'>{getLocalizedLabel('p_browse')}</div>
					) : (
						<div className='tab' onClick={() => AdFuncs.browseAdImage(count)}>
							{getLocalizedLabel('p_browse')}
						</div>
					)}
				</nav>
				<input
					type='file'
					id={`ad_image_${count}`}
					name={`ad_image_${count}`}
					onChange={AdFuncs.selectFile}
					style={{ display: 'none' }}
				/>
			</div>
		);
	});

	return (
		<React.Fragment>
			<div className='view-wrap'>{previews}</div>
			{Helper.errorLabel(imageErrorCode)}
			{images}
			<input type='hidden' name='main_picture_id' defaultValue={mainPictureId} />
			<input type='hidden' name='remove_ad_image' defaultValue={AdFuncs.removeAdImage()} />
		</React.Fragment>
	);
};

export default ImageList;
