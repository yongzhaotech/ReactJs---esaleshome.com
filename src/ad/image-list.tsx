import React from 'react';
import { smallImageSrc } from '../common/config';
import { useLocalizationContext } from '../context/localization-context';
import { useFunctions } from '../hook/ad-function-hook';
import { ErrorLabel } from '../box/form-fields';

type ImagePros = {
	imageSource: string;
};

const AdvertiseImage = ({ imageSource }: ImagePros) => (
	<img className='img_selected' src={imageSource} style={{ verticalAlign: 'top' }} alt='' />
);

const SelectedImage = ({ imageSource }: ImagePros) => (
	<img className='img_selected box-in' src={imageSource} style={{ verticalAlign: 'top' }} alt='' />
);

const Previews = () => {
	const { addedImages, selectedImages, advertiseImages } = useFunctions();

	return (
		<>
			{addedImages.map((count) => {
				const imageFound = advertiseImages[count] !== undefined;
				const imageSelected = selectedImages[count] !== undefined;

				if (imageFound || imageSelected) {
					return (
						<div key={count} className='img_wrapper'>
							{imageFound && <AdvertiseImage imageSource={`${smallImageSrc}${count}.jpg`} />}
							{imageSelected && <SelectedImage imageSource={selectedImages[count]} />}
						</div>
					);
				}

				return null;
			})}
		</>
	);
};

const Images = () => {
	const {
		addedImages,
		selectedImages,
		advertiseImages,
		mainPictureId,
		removeImage,
		browseAdImage,
		selectImage,
		imageErrorNumber,
		setMainPicture,
	} = useFunctions();
	const { getLocalizedLabel } = useLocalizationContext();

	return (
		<>
			{addedImages.map((count) => {
				const imageSelected = selectedImages[count] !== undefined;
				const imageFound = advertiseImages[count] !== undefined;

				return (
					<div
						key={count}
						className={`image_line ${imageSelected ? 'image_selected' : ''} ${
							+imageErrorNumber === count ? 'image_error' : ''
						}`}
					>
						<nav className='btn_list'>
							<div
								data-value={count}
								className={`tab ${mainPictureId === count ? 'active' : ''}`}
								onClick={setMainPicture}
							>
								{getLocalizedLabel('p_main')}
							</div>
							<div data-value={count} className='tab' onClick={removeImage}>
								{getLocalizedLabel('p_delete')}
							</div>
							{imageFound ? (
								<div className='tab inactive'>{getLocalizedLabel('p_browse')}</div>
							) : (
								<div data-value={count} className='tab' onClick={browseAdImage}>
									{getLocalizedLabel('p_browse')}
								</div>
							)}
						</nav>
						<input
							type='file'
							id={`ad_image_${count}`}
							name={`ad_image_${count}`}
							onChange={selectImage}
							style={{ display: 'none' }}
						/>
					</div>
				);
			})}
		</>
	);
};

const ImageList = () => {
	const { adImagesToRemove, mainPictureId, imageErrorCode } = useFunctions();

	return (
		<>
			<div className='view-wrap'>
				<Previews />
			</div>
			<ErrorLabel errorLabel={imageErrorCode} />
			<Images />
			<input type='hidden' name='main_picture_id' defaultValue={mainPictureId} />
			<input type='hidden' name='remove_ad_image' defaultValue={adImagesToRemove.join(',')} />
		</>
	);
};

export default ImageList;
