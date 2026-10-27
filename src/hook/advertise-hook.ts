import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Identifier } from '../types/common';
import type { Advertise } from '../types/ad';
import RootReducer from '../reducer';
import { largeImageSrc } from '../common/config';
import { updateStateModelData, loadingData, loadingLargeImageCount, saveStateObjects } from '../action';

interface ImageItem {
	i: Identifier;
}

let timeOutId: ReturnType<typeof setTimeout> | null = null;

type RootState = ReturnType<typeof RootReducer>;

export const imageIndex = (listImages: ImageItem[], currentImage: Identifier) => {
	let len = listImages.length;

	for (let i = 0; i < len; i++) {
		if (+currentImage === +listImages[i]['i']) {
			return i;
		}
	}
	return 0;
};

export const hasNextImage = (listImages: ImageItem[], currentImage: Identifier) => {
	return imageIndex(listImages, currentImage) < listImages.length - 1;
};

export const hasPrevImage = (listImages: ImageItem[], currentImage: Identifier) => {
	return imageIndex(listImages, currentImage) > 0;
};

export const useAdvertiseFunctions = () => {
	const dispatch = useDispatch();
	const OBJECTS = useSelector((state: RootState) => state.OBJECTS) as Record<string, any>;

	const loadImages = useCallback(
		(images: ImageItem[], imageCount: number, count: number) => {
			let init = 0;
			return images.map((imageObject) => {
				return new Promise((res, rej) => {
					const image = new Image();
					timeOutId = setTimeout(() => {
						image.src = `${largeImageSrc}${imageObject.i}.jpg`;
					}, 250 * ++init);
					image.onload = () => {
						dispatch(loadingLargeImageCount(`${++count} / ${imageCount}`));
						res(true);
					};
					image.onerror = () => {
						rej(false);
					};
				});
			});
		},
		[dispatch]
	);

	const viewImages = useCallback(
		({ picture_ids, picture_id, main_picture_id }: Advertise, p?: { i: Identifier }) => {
			// callers have different immages array shape
			const images = p ? picture_ids : picture_ids.map((id) => ({ i: id }));
			const imageCount = images.length;
			let count = 0;
			if (imageCount) {
				dispatch(loadingData(true, false, true));
				dispatch(loadingLargeImageCount(`${++count} / ${imageCount}`));
				Promise.all(loadImages(images as any, imageCount, count))
					.then(() => {
						if (timeOutId) {
							clearTimeout(timeOutId);
							timeOutId = null;
						}
						dispatch(loadingData());
						dispatch(loadingLargeImageCount());
						dispatch(
							updateStateModelData({
								currentImage: p?.i ?? main_picture_id ?? picture_id,
								largeImageFlag: true,
								listImages: images,
							})
						);
					})
					.catch((e) => {
						dispatch(loadingLargeImageCount());
					});
			}
		},
		[dispatch, loadImages]
	);

	const nextImage = useCallback(
		(listImages: ImageItem[], currentImage: Identifier, imageBox: HTMLElement) => {
			if (imageBox) {
				imageBox.className = 'fade-out';
			}
			setTimeout(() => {
				dispatch(
					updateStateModelData({
						currentImage: listImages[imageIndex(listImages, currentImage) + 1]['i'],
					})
				);
			}, 1201);
		},
		[dispatch]
	);

	const prevImage = useCallback(
		(listImages: ImageItem[], currentImage: Identifier, imageBox: HTMLElement) => {
			if (imageBox) {
				imageBox.className = 'fade-out';
			}
			setTimeout(() => {
				dispatch(
					updateStateModelData({
						currentImage: listImages[imageIndex(listImages, currentImage) - 1]['i'],
					})
				);
			}, 1201);
		},
		[dispatch]
	);

	const clearLargeImage = useCallback(
		(imageBox: HTMLElement) => {
			if (imageBox) {
				imageBox.className = 'fade-out';
			}
			setTimeout(() => {
				dispatch(
					updateStateModelData({
						currentImage: null,
						largeImageFlag: null,
						listImages: null,
					})
				);
			}, 1201);
		},
		[dispatch]
	);

	const flagDetail = useCallback(
		(ad: { id: Identifier }) => {
			let flag: Identifier | '' = '',
				open = OBJECTS['OPENFLAG'];
			if (open === ad.id) {
				open = '';
			} else {
				flag = ad.id;
				open = ad.id;
			}
			dispatch(
				saveStateObjects({
					DETAILFLAG: flag,
					OPENFLAG: open,
				})
			);
		},
		[OBJECTS, dispatch]
	);

	return {
		loadImages,
		viewImages,
		nextImage,
		prevImage,
		clearLargeImage,
		flagDetail,
	};
};
