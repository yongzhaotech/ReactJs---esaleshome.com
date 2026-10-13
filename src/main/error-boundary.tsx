import React, { Component } from 'react';

interface ErrorBoundaryProps extends React.PropsWithChildren<{}> {}

interface ErrorBoundaryState {
	errorOccurs: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			errorOccurs: false
		};
	}

	static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
		return { errorOccurs: true };
	}

	render() {
		return this.state.errorOccurs ? (
			<h1>Application Error!</h1>
		) : this.props.children;
	}
}
