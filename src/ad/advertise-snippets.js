import React from "react";
import { Grid } from "react-bootstrap";
import AdvertiseSnippet from "./advertise-snippet";

const AdvertiseSnippets = ({ ads }) => (
	<Grid>
		{ads.map(ad => (<AdvertiseSnippet key={ad.id} ad={ad} />))}
	</Grid>
);

export default React.memo(AdvertiseSnippets);
