import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorOccurs: false
		};
	}

	static getDerivedStateFromError(error) {
		return { errorOccurs: true };
	}
	
	render() {
		return this.state.errorOccurs ? (
			<h1>Application Error!</h1>
		) : this.props.children;
	}
};