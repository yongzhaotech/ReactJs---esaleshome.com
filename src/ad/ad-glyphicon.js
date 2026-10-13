import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { AdInfo } from '../common/ad-info';
import { Helper } from '../common/js-funcs';

const AdGlyphicon = ({ad, OBJECTS}) => {
	return (
		<div className="glyphicon-group">
			{AdInfo.byMail(ad) ? (<button type="button" className="action-button" aria-label="email the poster" onClick={() => Helper.attachActionBox('ask_poster', {id:ad.id,name:ad.name})}><Glyphicon glyph="envelope" /></button>) : null}
			{AdInfo.byPhone(ad) ? (<a href={`tel:${ad.contact_phone}`} aria-label="use your cell to call the poster"><Glyphicon glyph="phone" /></a>) : null}
			<button type="button" className="action-button" aria-label="send the ad to your friend" onClick={() => Helper.attachActionBox('email_friend', {id:ad.id,name:ad.name})}><Glyphicon glyph="share" /></button>
			<button type="button" className="action-button" aria-label="ad details" onClick={() => AdInfo.flagDetail(ad)}><Glyphicon glyph={`${OBJECTS.DETAILFLAG === ad.id ? 'check' : 'unchecked'}`} /></button>
		</div>
	);
};

export default AdGlyphicon;