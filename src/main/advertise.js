import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import '../style/advertise.less';
import { Engine } from '../common/engine';
import RouteEngine from './route-engine';
import { Http } from '../common/http-client';
import { connection } from '../common/config';

class Advertise extends Component {
	constructor(props) {
		super(props);
		Engine.cookie(props.cookies);
        Engine.registerEvents();
		this.state = {
			launchApplication: -1
		};
	}

	componentDidMount() {
		Http.ServerRequest('request', {action: 'connection'}).then(promise => {
			if(!!promise.data.connectionSuccess) {
				this.setState({
					launchApplication: 1
				});
			}else {
				this.setState({
					launchApplication: 0
				});
			}
		}).catch(e => {
			this.setState({
				launchApplication: 0
			});
		});
	}
	
	render() {
		return this.state.launchApplication > 0 ? (
			<RouteEngine />
		) : (
			<section className="not-signed-in">
				<span>{connection[this.state.launchApplication]}</span>
			</section>
		);
	}
}

export default withCookies(Advertise);
