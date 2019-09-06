import React, { Component } from 'react';
import { getLabel } from '../common/label';
import { AdFuncs} from '../common/ad-funcs';
import { Engine } from '../common/engine';
import { smallImageSrc } from '../common/config';
import { Helper } from '../common/js-funcs';

class ImageList extends Component {
	render() {
		let	numbers = Array.from(Engine.store().MODELS['images'] || []),
			previews = numbers.map(count => {
				let [imageFound, imageSelected] = [AdFuncs.imageFound(count), AdFuncs.imageSelected(count)];
				return (
					imageFound || imageSelected ?
					(
						<div key={count} className="img_wrapper">
							{imageFound ? (<img className="img_selected" src={`${smallImageSrc}${count}.jpg`} align="top" alt="" />) : null}
							{imageSelected ? (<img className="img_selected box-in" src={AdFuncs.imageSource(count)} align="top" alt="" />) : null}
						</div>
					) : null
				)
			}),
			images = numbers.map(count => { return (
				<div key={count} className={`image_line ${AdFuncs.imageSelected(count) ? 'image_selected' : ''} ${AdFuncs.imageError(count) ? 'image_error' : ''}`}>
					<nav className="btn_list">
						<div className={`tab ${Engine.store().MODELS['mainPictureId'] === count ? 'active' : ''}`} onClick={() => AdFuncs.setMainPicture(count)}>{getLabel('p_main')}</div>
						<div className="tab" onClick={() => {AdFuncs.rmAdImage(count)}}>{getLabel('p_delete')}</div>
						{
							AdFuncs.imageFound(count) ? (<div className="tab inactive" >{getLabel('p_browse')}</div>) : 
								(<div className="tab" onClick={() => {AdFuncs.browseAdImage(count)}}>{getLabel('p_browse')}</div>)
						}
					</nav>
					<input type="file" id={`ad_image_${count}`} name={`ad_image_${count}`} onChange={AdFuncs.selectFile} style={{display:'none'}} />
				</div>
			)});

		return (
			<React.Fragment>
				<div className="view-wrap">
					{previews}
				</div>
				{Helper.errorLabel(AdFuncs.imageErrorCode())}
				{images}
				<input type="hidden" name="main_picture_id" defaultValue={Engine.store().MODELS['mainPictureId']} />
				<input type="hidden" name="remove_ad_image" defaultValue={AdFuncs.removeAdImage()} />
			</React.Fragment>
		);
	};
}

export default ImageList;
