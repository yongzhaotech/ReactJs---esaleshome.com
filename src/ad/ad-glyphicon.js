import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { AdInfo } from '../common/ad-info';
import { Helper } from '../common/js-funcs';

export default ({ad, OBJECTS}) => {
	return (
		<div className="glyphicon-group">
			{AdInfo.byMail(ad) ? (<a href="" aria-label="email the poster" onClick={(e) => {e.preventDefault(); Helper.attachActionBox('ask_poster', {id:ad.id,name:ad.name})}}><Glyphicon glyph="envelope" /></a>) : null}
			{AdInfo.byPhone(ad) ? (<a href={`tel:${ad.contact_phone}`} aria-label="use your cell to call the poster"><Glyphicon glyph="phone" /></a>) : null}
			<a href="" aria-label="send the ad to your friend" onClick={(e) => {e.preventDefault(); Helper.attachActionBox('email_friend', {id:ad.id,name:ad.name})}}><Glyphicon glyph="share" /></a>
			<a href="" aria-label="ad details" onClick={(e) => {e.preventDefault(); AdInfo.flagDetail(ad)}}><Glyphicon glyph={`${OBJECTS.DETAILFLAG === ad.id ? 'check' : 'unchecked'}`} /></a>
		</div>
	);
};