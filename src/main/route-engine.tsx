import React, { ComponentType } from 'react';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { Config } from './route-config';
import ActionBox from '../box/action-box';
import Footer from '../box/footer';
import Loading from '../box/loading';
import { route } from '../utils';

const RouteComponent = (props: RouteComponentProps<any>, Comp: ComponentType) => {
	const {
		match: { params },
		history,
	} = props;
	
	route.params = params;
	route.history = history;

	return (
		<main id='ad_content_area'>
			<Comp {...(props as object)} />
		</main>
	);
};

class RouteEngine extends React.Component {
	render() {
		return (
			<>
				<ActionBox />
				<Router>
					<Switch>
						{Config.map((route, index) => (
							<Route
								key={index}
								exact={route.exact}
								path={route.path}
								render={(props) => RouteComponent(props, route.comp)}
							/>
						))}
					</Switch>
				</Router>
				<Footer />
				<Loading />
			</>
		);
	}
}

export default RouteEngine;
