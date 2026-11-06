import React, { useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch } from 'react-redux';
import UserTabs from './user-tabs';
import { fetchUserData } from '../action';
import { session } from '../utils';
import ReactLoader from '../ad/react-loader';

const Snippets = lazy(() => import('./user-advertise-snippets'));

const UserAdvertise = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (session.userSignedIn) {
			dispatch(fetchUserData([{ dataKey: 'profile' }, { dataKey: 'ads' }]));
		}
	}, [dispatch]);

	return (
		<>
			<UserTabs />
			<Suspense fallback={<ReactLoader />}>
				<ErrorBoundary fallback={<strong>Could not load ad snippets.</strong>}>
					<Snippets />
				</ErrorBoundary>
			</Suspense>
		</>
	);
};

export default UserAdvertise;
