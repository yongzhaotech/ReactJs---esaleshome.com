import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Loading } from '../src/box/loading';
import * as label from '../src/common/label';

configure({adapter: new Adapter()});

describe('Testing loading indicator', () => {
	describe('When ISLOADINGDATA is true', () => {
		beforeEach(() => {
			label.getLabel = jest.fn();
		});
		test('Show loading indicator but no title if HIDELOADINGTITLE is true', () => {
			const loadingData = {loadingData: {ISLOADINGDATA: true, HIDELOADINGTITLE: true}}, 
				loading = shallow(<Loading {...loadingData} />);
			expect(loading.html()).toBeTruthy();
			expect(label.getLabel).not.toHaveBeenCalled();
		});
		
		test('Show loading indicator with title if HIDELOADINGTITLE is false', () => {
			const loadingData = {loadingData: {ISLOADINGDATA: true, HIDELOADINGTITLE: false}}, 
				loading = shallow(<Loading {...loadingData} />);
			expect(loading.html()).toBeTruthy();
			expect(label.getLabel).toHaveBeenCalledWith('loading_data');
		});
		
		test('Show loading large images count if loadingImagesMessage is true', () => {
			const loadingData = {loadingData: {ISLOADINGDATA: true, HIDELOADINGTITLE: false}, loadingImagesMessage: '1/2'}, 
				loading = shallow(<Loading {...loadingData} />);
			expect(loading.html()).toBeTruthy();
			expect(label.getLabel.mock.calls[0][0]).toEqual('loading_data');
			expect(label.getLabel.mock.calls[1][0]).toEqual('loading_large_image');
		});
	});

	test('Not show loading indicator when ISLOADINGDATA is false', () => {
		const loadingData = {loadingData: {ISLOADINGDATA: false, HIDELOADINGTITLE: true}}, 
			loading = shallow(<Loading {...loadingData} />);
		expect(loading.html()).toBeFalsy();
	});
});
