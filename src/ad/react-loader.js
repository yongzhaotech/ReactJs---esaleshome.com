import React, { Component } from 'react';
import logo from '../logo.svg';

class ReactLoader extends Component {
	render() {
		return (
			<section className="loading">
				<div className="transparent">
					<img className="rotate-on" alt="" src={logo} height="65" />
				</div>
			</section>
		);
	};
}

export default ReactLoader;
