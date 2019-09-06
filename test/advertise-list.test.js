import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AdvertiseList } from '../src/ad/advertise-list';
import { Engine } from '../src/common/engine';
import { fetchAdvertises } from '../src/action';

configure({adapter: new Adapter()});

describe('Testing advertise-list', () => {
	beforeEach(() => {
		Engine.dispatch = jest.fn();
		Engine.component = jest.fn();
	});
	test('If performSearch is not passed in, Engine dispatch is called', () => {
		const advertiseList = shallow(<AdvertiseList />);
		expect(Engine.dispatch).toHaveBeenCalledWith(fetchAdvertises());
	});
	
	test('No ads, ReactLoader is rendered', () => {
		const advertiseList = shallow(<AdvertiseList />);
		expect(advertiseList.html()).toMatch(/loading/);
	});
	
	test('Has ads, list is rendered', () => {
		const advertiseList = shallow(<AdvertiseList resultSets={{ads: [{}, {}]}} />);
		expect(advertiseList.html()).toMatch(/ang_ad_list_wrapper/);
	});
});
