import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import RootReducer from '../reducer';
import { largeImageSrc } from '../common/config';
import type { Identifier } from '../types/common';
import { useAdvertiseFunctions, hasPrevImage, hasNextImage } from '../hook/advertise-hook';

interface ImageItem {
	i: Identifier;
}

type MODELSState = {
	largeImageFlag?: boolean;
	currentImage?: Identifier;
	listImages?: ImageItem[];
};

type RootState = ReturnType<typeof RootReducer>;

const LargeImages = () => {
	const { nextImage, prevImage, clearLargeImage } = useAdvertiseFunctions();
	const MODELS = useSelector((state: RootState) => state.MODELS) as MODELSState;
	const { largeImageFlag = false, currentImage = 0, listImages = [] } = MODELS;
	const currentImageReference = useRef<HTMLDivElement>(null);

	if (!largeImageFlag) {
		return null;
	}

	return (
		<section className='large-image-wrapper'>
			{listImages.map((img) => {
				return +currentImage === +img.i ? (
					<div key={img.i} className='fade-in' ref={currentImageReference}>
						<img className='large-image' src={`${largeImageSrc}${img.i}.jpg`} alt='' />
						<div className='toggle'>
							<div
								className='toggler'
								aria-label={`${hasPrevImage(listImages, currentImage) ? 'show previous large image' : 'hide-image-toggler'}`}
								onClick={() => {
									if (currentImageReference.current) {
										prevImage(listImages, currentImage, currentImageReference.current);
									}
								}}
							>
								&#10092;
							</div>
							<div
								className='toggler'
								aria-label={'close large image'}
								onClick={() => {
									clearLargeImage(currentImageReference.current!);
								}}
							>
								&#10005;
							</div>
							<div
								className='toggler'
								aria-label={`${hasNextImage(listImages, currentImage) ? 'show next large image' : 'hide-image-toggler'}`}
								onClick={() => {
									if (currentImageReference.current) {
										nextImage(listImages, currentImage, currentImageReference.current);
									}
								}}
							>
								&#10093;
							</div>
						</div>
					</div>
				) : null;
			})}
		</section>
	);
};

export default LargeImages;
