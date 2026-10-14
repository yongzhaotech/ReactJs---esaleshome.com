import React, { Component } from 'react';
import { Cookies, withCookies } from 'react-cookie';
import '../style/advertise.less';
import { Engine } from '../common/engine';
import RouteEngine from './route-engine';
import { Http } from '../common/http-client';
import { connection } from '../common/config';

interface AdvertiseProps {
	cookies?: Cookies;
}

interface AdvertiseState {
	launchApplication: -1 | 0 | 1;
}

class Advertise extends Component<AdvertiseProps, AdvertiseState> {
	constructor(props: AdvertiseProps) {
		super(props);
		const cookies = props.cookies;
		if (cookies) {
			Engine.cookie({
				get: name => cookies.get(name),
				set: (name, value, options) => cookies.set(name, value, options)
			});
		}
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
				<span>{connection[this.state.launchApplication === -1 ? '-1' : '0']}</span>
			</section>
		);
	}
}

export default withCookies(Advertise);
