import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage"
import RootReducer from './reducer';
import RootSaga from './saga';
import Advertise from './main/advertise';
import { Engine } from './common/engine';
import registerServiceWorker from './registerServiceWorker';

const config = {
	key: "esaleshome-app",
	storage,
	whitelist: ["language"]
},
	sagaMiddleware = createSagaMiddleware(),
	store = createStore(
		persistReducer(config, RootReducer),
		applyMiddleware(sagaMiddleware)
	);

Engine.register(store);

sagaMiddleware.run(RootSaga);

ReactDOM.render((
	<Provider store={store}>
		<CookiesProvider>
			<PersistGate loading={null} persistor={persistStore(store)}>
				<Advertise />
			</PersistGate>
		</CookiesProvider>
	</Provider>
), document.getElementById('esaleshome-root')
);
registerServiceWorker();