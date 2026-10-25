import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { updateStateModelData } from '../action';
import { StaticVars } from '../static/static-vars';

type ImageDataSource = string;

export type ImageNumber = number;

type AdvertiseImages = Record<ImageNumber, 1>;

type SelectedImages = Record<ImageNumber, ImageDataSource>;

type ContactMethods = Record<string, 1 | ''>;

type RootState = ReturnType<typeof RootReducer>;

type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type MODELSState = {
	images?: ImageNumber[];
	adImages?: AdvertiseImages;
	adImagesToRemove?: ImageNumber[];
	is_free: string;
	currency: string;
	selectedImages?: SelectedImages;
	imageErrorNumber?: string;
	imageErrorCode?: string;
	mainPictureId: ImageNumber;
	contactMethods?: ContactMethods;
	_contactMethods?: ContactMethods;
};

const allowedImageNumber = StaticVars.inum;

export const useFunctions = () => {
	const dispatch = useDispatch();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const {
		images: addedImages = [],
		currency: currentCurrency,
		is_free: isFree,
		selectedImages = {},
		adImages: advertiseImages = {},
		adImagesToRemove = [],
		imageErrorNumber = '',
		imageErrorCode = '',
		mainPictureId,
		contactMethods = {},
		_contactMethods = {},
	} = MODELS;

	const maximumImagesNumberReached = addedImages.length >= allowedImageNumber;

	const { itemIsFree, itemIsNotFree } = useMemo(() => {
		const nothing = isFree === null;

		return {
			itemIsFree: !nothing && +isFree === 1,
			itemIsNotFree: !nothing && +isFree === 0,
		};
	}, [isFree]);

	const setItemFree = useCallback(
		(e: ButtonEvent) => {
			e.preventDefault();
			if (itemIsFree) {
				return;
			}
			dispatch(
				updateStateModelData({
					price: '',
					is_free: '1',
					currency: '',
				})
			);
		},
		[dispatch, itemIsFree]
	);

	const setItemNotFree = useCallback(
		(e: ButtonEvent) => {
			e.preventDefault();
			if (itemIsNotFree) {
				return;
			}
			dispatch(
				updateStateModelData({
					is_free: '0',
				})
			);
		},
		[dispatch, itemIsNotFree]
	);

	const setCurrency = useCallback(
		(e: ButtonEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			const currency = target.dataset.value;
			if (currentCurrency !== currency) {
				dispatch(
					updateStateModelData({
						currency,
					})
				);
			}
		},
		[dispatch, currentCurrency]
	);

	const addImage = useCallback(
		(e: ButtonEvent) => {
			e.preventDefault();
			const addedImagesCount = addedImages.length;
			const addedImageNumber = addedImagesCount === 0 ? 1 : +addedImages[addedImagesCount - 1] + 1;
			const images = [...addedImages, addedImageNumber];
			dispatch(
				updateStateModelData({
					images,
				})
			);
		},
		[addedImages, dispatch]
	);

	const setMainPicture = useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			const target = e.target as HTMLElement;
			const dataValue = target.dataset.value ?? '';
			const imageNumber = +dataValue;

			dispatch(
				updateStateModelData({
					mainPictureId: imageNumber,
				})
			);
		},
		[dispatch]
	);

	const removeImage = useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			const target = e.target as HTMLElement;
			const dataValue = target.dataset.value ?? '';
			const imageNumber = +dataValue;
			const found = addedImages.some((num) => +num === imageNumber);

			if (found) {
				const images = addedImages.filter((num) => +num !== imageNumber);
				const payload: Record<string, any> = { images };
				if (selectedImages[imageNumber]) {
					delete selectedImages[imageNumber];
				}
				if (+imageErrorNumber === imageNumber) {
					payload.imageErrorNumber = '';
					payload.imageErrorCode = '';
				}
				if (+mainPictureId === imageNumber) {
					payload.mainPictureId = '';
				}
				dispatch(updateStateModelData(payload));
			}
			if (advertiseImages[imageNumber]) {
				delete advertiseImages[imageNumber];
				dispatch(
					updateStateModelData({
						adImages: advertiseImages,
						adImagesToRemove: [...adImagesToRemove, imageNumber],
					})
				);
			}
		},
		[addedImages, dispatch, imageErrorNumber, mainPictureId, selectedImages, advertiseImages, adImagesToRemove]
	);

	const browseAdImage = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const target = e.target as HTMLElement;
		const dataValue = target.dataset.value ?? '';
		const imageNumber = +dataValue;
		const camera = document.getElementById(`ad_image_${imageNumber}`);
		if (camera) {
			camera.click();
		}
	}, []);

	const selectImage = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let error = '';
			const info = e.target.files?.[0];
			const match = e.target.name.match(/^ad_image_(\d+)$/);
			if (!match) {
				throw new Error(`Unexpected ad image input name: ${e.target.name}`);
			}
			const imageNumber = match[1];

			if (!info) {
				return;
			}

			if (!info.type.match(/^image.*(peg)|(bmp)|(png)$/i)) {
				error = 'w_pit_file';
			} else if (info.size / 1048576 > StaticVars['imb']) {
				error = 'w_max_pit_size';
			}
			if (error) {
				dispatch(
					updateStateModelData({
						imageErrorNumber: imageNumber,
						imageErrorCode: error,
					})
				);
			} else {
				dispatch(
					updateStateModelData({
						imageErrorNumber: '',
						imageErrorCode: '',
					})
				);
				const reader = new FileReader();
				reader.readAsDataURL(info);
				reader.onload = () => {
					if (typeof reader.result !== 'string') {
						return;
					}
					selectedImages[+imageNumber] = reader.result;
					dispatch(
						updateStateModelData({
							selectedImages,
						})
					);
				};
			}
		},
		[dispatch, selectedImages]
	);

	const setContactMethod = useCallback(
		(e: ButtonEvent) => {
			e.preventDefault();
			const target = e.target as HTMLElement;
			const contactMethod = target.dataset.value as string;

			if (_contactMethods[contactMethod] !== undefined) {
				delete _contactMethods[contactMethod];
				contactMethods[contactMethod] = '';
				dispatch(
					updateStateModelData({
						contactMethods,
					})
				);
			} else {
				_contactMethods[contactMethod] = 1;
				dispatch(
					updateStateModelData({
						_contactMethods,
					})
				);
			}
		},
		[contactMethods, _contactMethods, dispatch]
	);

	return {
		itemIsFree,
		itemIsNotFree,
		maximumImagesNumberReached,
		addedImages,
		advertiseImages,
		setItemFree,
		setItemNotFree,
		setCurrency,
		addImage,
		removeImage,
		setMainPicture,
		browseAdImage,
		selectImage,
		setContactMethod,
		adImagesToRemove,
		mainPictureId,
		selectedImages,
		imageErrorNumber,
		imageErrorCode,
		selectedContactMethods: _contactMethods,
	};
};
