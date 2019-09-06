import { isIE } from 'react-device-detect';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import RootReducer from './reducer';
import RootSaga from './saga';
import Advertise from './main/advertise';
import { Engine } from './common/engine';
import registerServiceWorker from './registerServiceWorker';

const sagaMiddleware = createSagaMiddleware(),
store = createStore(
	RootReducer,
	applyMiddleware(sagaMiddleware)
);

Engine.register(store);

sagaMiddleware.run(RootSaga);

ReactDOM.render(
	isIE ? (
		<section className="not-signed-in">
			<span>Internet Explorer is not supported!</span>
		</section>
	) : (
		<Provider store={store}>
			<CookiesProvider>
				<Advertise />
			</CookiesProvider>
		</Provider>
	),
	document.getElementById('esaleshome-root')
);
registerServiceWorker();