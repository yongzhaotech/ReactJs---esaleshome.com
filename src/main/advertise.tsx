import React, { useEffect, useState } from 'react';
import { Cookies, withCookies } from 'react-cookie';
import '../style/advertise.less';
import { Engine } from '../common/engine';
import RouteEngine from './route-engine';
import { Http } from '../common/http-client';
import { connection } from '../common/config';
import { LocalizationContext } from '../context/localization-context';
import { ReferenceContext } from '../context/reference-context';
import { session } from '../utils';

interface AdvertiseProps {
	cookies: Cookies;
}

const Advertise = ({ cookies }: AdvertiseProps) => {
	const [launchApplication, setLaunchApplication] = useState<-1 | 0 | 1>(-1);

	useEffect(() => {
		if (cookies) {
			Engine.cookie({
				get: (name) => cookies.get(name),
				set: (name, value, options) => cookies.set(name, value, options),
			});

			session.cookies = cookies;
		}
	}, [cookies]);

	useEffect(() => {
		return Engine.registerEvents();
	}, []);

	useEffect(() => {
		let isMounted = true;
		Http.ServerRequest('request', { action: 'connection' })
			.then((promise) => {
				if (isMounted) {
					setLaunchApplication(promise.data.connectionSuccess ? 1 : 0);
				}
			})
			.catch(() => {
				if (isMounted) {
					setLaunchApplication(0);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return launchApplication > 0 ? (
		<LocalizationContext cookies={cookies}>
			<ReferenceContext>
				<RouteEngine />
			</ReferenceContext>
		</LocalizationContext>
	) : (
		<section className='not-signed-in'>
			<span>{connection[launchApplication === -1 ? '-1' : '0']}</span>
		</section>
	);
};

export default withCookies(Advertise);
