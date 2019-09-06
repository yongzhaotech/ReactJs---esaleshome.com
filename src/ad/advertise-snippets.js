import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import AdvertiseSnippet from './advertise-snippet';

class AdvertiseSnippets extends Component {
	render() {
		const { ads } = this.props;

		let output = ads.map(ad => (<AdvertiseSnippet key={ad.id} ad={ad} />));

		return (
			<Grid>
				{output}
			</Grid>
		);
	};
}

export default AdvertiseSnippets;
