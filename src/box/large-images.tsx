import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdInfo } from '../common/ad-info';
import { largeImageSrc } from '../common/config';

type Identifier = string | number;
type Step = '' | 'previous' | 'next';

interface ImageItem {
	i: Identifier;
}

interface LargeImagesModels {
	largeImageFlag?: boolean;
	currentImage?: Identifier;
	listImages?: ImageItem[];
}

interface LargeImagesProps {
	MODELS: LargeImagesModels;
}

interface LargeImagesState {
	step: Step;
}

interface LargeImagesReduxState {
	MODELS: LargeImagesModels;
}

class LargeImages extends Component<LargeImagesProps, LargeImagesState> {
	private currentImage: HTMLDivElement | null = null;
	private previousReference: HTMLDivElement | null = null;
	private closeReference: HTMLDivElement | null = null;
	private nextReference: HTMLDivElement | null = null;
	private currentButton: HTMLDivElement | null = null;

	state: LargeImagesState = {
		step: ''
	};

	private createReference = (element: HTMLDivElement | null): void => {
		this.currentImage = element;
	};

	private createPreviousReference = (element: HTMLDivElement | null): void => {
		this.previousReference = element;
	};

	private createCloseReference = (element: HTMLDivElement | null): void => {
		this.closeReference = element;
	};

	private createNextReference = (element: HTMLDivElement | null): void => {
		this.nextReference = element;
	};

	componentDidUpdate() {
		const { previousReference, closeReference, nextReference } = this;
		if(this.currentImage && previousReference && closeReference && nextReference) {
			if(this.state.step === 'previous') {
				if(previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = previousReference;
				}else if(nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = nextReference;
				}else {
					this.currentButton = closeReference;
				}
			}else if(this.state.step === 'next') {
				if(nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = nextReference;
				}else if(previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = previousReference;
				}else {
					this.currentButton = closeReference;
				}
			}else if(previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
				this.currentButton = previousReference;
			}else if(nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
				this.currentButton = nextReference;
			}else {
				this.currentButton = closeReference;
			}
			this.currentButton?.setAttribute('tabindex', '0');
			this.currentButton?.focus();
			
			const buttons = [previousReference, closeReference, nextReference],
				count = buttons.length;
			
			buttons.forEach((button, index) => {
				button.onkeydown = (e: KeyboardEvent) => {
					let preventDefault = false;
					switch (e.keyCode) {
						case 13:
							button.click();
							break;
						case 9:
							if(e.shiftKey) {
								if(index > 0 && buttons[index - 1].getAttribute('aria-label') !== 'hide-image-toggler') {
									buttons[index - 1].setAttribute('tabindex', '0');
									buttons[index - 1].focus();
								}								
							}else {
								if(index < count - 1 && buttons[index + 1].getAttribute('aria-label') !== 'hide-image-toggler') {
									buttons[index + 1].setAttribute('tabindex', '0');
									buttons[index + 1].focus();
								}								
							}
							preventDefault = true;
							break;
						case 39:
							if(index < count - 1 && buttons[index + 1].getAttribute('aria-label') !== 'hide-image-toggler') {
								buttons[index + 1].setAttribute('tabindex', '0');
								buttons[index + 1].focus();
							}
							break;
						case 37:
							if(index > 0 && buttons[index - 1].getAttribute('aria-label') !== 'hide-image-toggler') {
								buttons[index - 1].setAttribute('tabindex', '0');
								buttons[index - 1].focus();
							}
							break;
						default:
							preventDefault = true;
							break;
					}
					preventDefault && e.preventDefault();
				}
			});
		}
	}

	render() {
		const { MODELS } = this.props,
			largeImageFlag = MODELS.largeImageFlag || false,
			currentImage = MODELS.currentImage || 0,
			listImages = MODELS.listImages || [];
		if(!largeImageFlag) {
			return null;
		}
		return (
            <section className="large-image-wrapper">
				{
					listImages.map(img => {
						return +currentImage === +img.i ? (
						<div key={img.i} className="fade-in" ref = {this.createReference}>
							<img
								className = "large-image"
								src = {`${largeImageSrc}${img.i}.jpg`}
								alt = ''
							/>
							<div className="toggle">
								<div
									className="toggler"
									ref = {this.createPreviousReference}
									aria-label={`${AdInfo.hasPrevImage(listImages, currentImage) ? 'show previous large image' : 'hide-image-toggler'}`}
									onClick={() => {this.setState({step: 'previous'}); if(this.currentImage) AdInfo.prevImage(listImages, currentImage, this.currentImage)}}
								>
									&#10092;
								</div>
								<div
									className="toggler"
									ref = {this.createCloseReference}
									aria-label={'close large image'}
									onClick={() => {this.setState({step: ''}); AdInfo.clearLargeImage(this.currentImage)}}
								>
									&#10005;
								</div>
								<div
									className="toggler"
									ref = {this.createNextReference}
									aria-label={`${AdInfo.hasNextImage(listImages, currentImage) ? 'show next large image' : 'hide-image-toggler'}`}
									onClick={() => {this.setState({step: 'next'}); if(this.currentImage) AdInfo.nextImage(listImages, currentImage, this.currentImage)}}
								>
									&#10093;
								</div>
							</div>
						</div>
						) : null
					})
				}
			</section>
		);
	};
};

const mapStateToProps = (state: LargeImagesReduxState) => ({
	MODELS: state.MODELS
});

export default connect(
	mapStateToProps
)(LargeImages);
