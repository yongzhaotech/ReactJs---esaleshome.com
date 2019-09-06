import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AdInfo } from '../common/ad-info';
import { largeImageSrc } from '../common/config';

class LargeImages extends Component {
	constructor(props) {
		super(props);
		this.currentImage = null;
		this.previousReference = null;
		this.closeReference = null;
		this.nextReference = null;
		this.currentButton = null;
		this.state = {
			step: ''
		};

		this.createReference = element => {
            this.currentImage = element;
        };

        this.createPreviousReference = element => {
            this.previousReference = element;
        };
		
		this.createCloseReference = element => {
			this.closeReference = element;
		};
		
		this.createNextReference= element => {
            this.nextReference = element;
        };
	}

	componentDidUpdate() {
		if(this.currentImage) {
			if(this.state.step === 'previous') {
				if(this.previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = this.previousReference;
				}else if(this.nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = this.nextReference;
				}else {
					this.currentButton = this.closeReference;
				}
			}else if(this.state.step === 'next') {
				if(this.nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = this.nextReference;
				}else if(this.previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
					this.currentButton = this.previousReference;
				}else {
					this.currentButton = this.closeReference;
				}
			}else if(this.previousReference.getAttribute('aria-label') !== 'hide-image-toggler') {
				this.currentButton = this.previousReference;
			}else if(this.nextReference.getAttribute('aria-label') !== 'hide-image-toggler') {
				this.currentButton = this.nextReference;
			}else {
				this.currentButton = this.closeReference;
			}
			this.currentButton.setAttribute('tabindex', 0);
			this.currentButton.focus();
			
			let buttons = [this.previousReference, this.closeReference, this.nextReference],
				count = buttons.length;
			
			buttons.forEach((button, index) => {
				button.onkeydown = e => {
					let preventDefault = false;
					switch (e.keyCode) {
						case 13:
							button.click();
							break;
						case 9:
							if(e.shiftKey) {
								if(index > 0 && buttons[index - 1].getAttribute('aria-label') !== 'hide-image-toggler') {
									buttons[index - 1].setAttribute('tabindex', 0);
									buttons[index - 1].focus();
								}								
							}else {
								if(index < count - 1 && buttons[index + 1].getAttribute('aria-label') !== 'hide-image-toggler') {
									buttons[index + 1].setAttribute('tabindex', 0);
									buttons[index + 1].focus();
								}								
							}
							preventDefault = true;
							break;
						case 39:
							if(index < count - 1 && buttons[index + 1].getAttribute('aria-label') !== 'hide-image-toggler') {
								buttons[index + 1].setAttribute('tabindex', 0);
								buttons[index + 1].focus();
							}
							break;
						case 37:
							if(index > 0 && buttons[index - 1].getAttribute('aria-label') !== 'hide-image-toggler') {
								buttons[index - 1].setAttribute('tabindex', 0);
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
		let {MODELS} = this.props,
			largeImageFlag = MODELS['largeImageFlag'] || false,
			currentImage = MODELS['currentImage'] || 0,
			listImages = MODELS['listImages'] || [];
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
									onClick={() => {this.setState({step: 'previous'}); AdInfo.prevImage(listImages, currentImage, this.currentImage)}}
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
									onClick={() => {this.setState({step: 'next'}); AdInfo.nextImage(listImages, currentImage, this.currentImage)}}
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

const mapStateToProps = state => ({
	MODELS: state.MODELS
});

export default connect(
	mapStateToProps
)(LargeImages);
