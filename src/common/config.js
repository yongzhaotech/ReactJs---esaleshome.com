import { isMobile } from 'react-device-detect';
export const host = 'http://esaleshome.com:88';
export const largeImageSrc = '/ads/src/image/ad/large/';
export const smallImageSrc = '/ads/src/image/ad/small/';
//export const host = 'http://localhost:88';
//export const largeImageSrc = 'http://esaleshome.com/ads/src/image/ad/large/';
//export const smallImageSrc = 'http://esaleshome.com/ads/src/image/ad/small/';
export const optionHeight = '33.5px';
export const startColumnNumber = isMobile ? 2 : 4;
export const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const connection = {
	'-1': '',
	'0': 'Your network might have denied access to esaleshome.com:88'
};
export const title = 'esaleshome.com';