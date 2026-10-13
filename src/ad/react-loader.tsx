import React from 'react';
import logo from '../logo.svg';

const ReactLoader = () => (
	<section className="loading">
		<div className="transparent">
			<img className="rotate-on" alt="" src={logo} height="65" />
		</div>
	</section>
);

export default ReactLoader;
