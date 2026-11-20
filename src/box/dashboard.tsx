import React, { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, type AuthProviderProps, useAuth } from 'react-oidc-context';

const cache = new Map<string, Promise<Record<string, unknown>>>();

const oidcConfig: AuthProviderProps = {
	authority: 'http://localhost:88',
	client_id: 'esales_home_learning',
	redirect_uri: 'http://localhost:3000/ads/dashboard',
	response_type: 'code', // Enables Authorization Code + PKCE
	scope: 'openid profile email api.read',

	// Optional but recommended: removes "?code=...&state=..." from the address bar
	// once react-oidc-context finishes exchanging the code for tokens
	onSigninCallback: () => {
		window.history.replaceState({}, document.title, window.location.pathname);
	},
};

const profilePromise = ({ accessToken }: { accessToken: string }): Promise<Record<string, unknown>> => {
	const url = 'http://localhost:88/profile';
	const key = `${url}:${accessToken}`;
	let request = cache.get(key);
	if (!request) {
		request = fetch(url, {
			headers: { Authorization: `Bearer ${accessToken}` },
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error(`Profile request failed (${res.status})`);
			}
			return res.json() as Promise<Record<string, unknown>>;
		});
		// Cache the in-flight promise too. Suspense retries rendering while it is
		// pending; caching only a successful response would start another request
		// on every retry, especially when the request rejects (for example, 404).
		cache.set(key, request);
	}
	return request;
};

const Profile = ({ accessToken }: { accessToken: string }) => {
	const profile = use(profilePromise({ accessToken }));
	return <div>{profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}</div>;
};

// 2. In any React component

const Content = () => {
	const auth = useAuth();

	if (auth.isLoading) {
		return <p>Loading OIDC provider...</p>;
	}
	if (auth.error) {
		return <p role='alert'>OIDC error: {auth.error.message}</p>;
	}

	if (!auth.isAuthenticated) {
		return <button onClick={() => void auth.signinRedirect()}>Log In</button>;
	}

	return (
		<div>
			<p>Signed in as {auth.user?.profile.email as string}</p>
			<ErrorBoundary fallback={<p role='alert'>Failed to load profile</p>}>
				<Suspense fallback={<p>Loading profile...</p>}>
					<Profile accessToken={auth.user?.access_token as string} />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export const Dashboard = () => {
	return (
		<AuthProvider {...oidcConfig}>
			<Content />
		</AuthProvider>
	);
};
