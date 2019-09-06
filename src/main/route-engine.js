import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Helper } from '../common/js-funcs';
import { Config } from './route-config';

class RouteEngine extends Component {
	render() {
		return (
			<Router>
				<Switch>
					{
						Config.map((route, index) => (
							<Route
								key={index}
								exact={route.exact}
								path={route.path}
								render={(props) => Helper.routeComponent(props, route.comp, route.list || false)}
							/>	
						))
					}
				</Switch>
			</Router>
		);
	}
}

export default RouteEngine;
