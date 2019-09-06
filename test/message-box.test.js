import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MessageBox from '../src/box/message-box';
import * as label from '../src/common/label';
import { Helper } from '../src/common/js-funcs';
import { Engine } from '../src/common/engine';

configure({adapter: new Adapter()});

describe('Testing loading indicator', () => {
	describe('When MESSAGEFLAG is not set', () => {
		test('Message Box is not rendered', () => {
			const messageBox = shallow(<MessageBox messageCenter={{}} />);
			expect(messageBox.html()).toBeNull();
		});
	});

	describe('When MESSAGEFLAG is set', () => {
		beforeEach(() => {
			label.getLabel = jest.fn();
			Helper.executeFunc = jest.fn();
			Helper.clearMessage = jest.fn();
			Engine.store = jest.fn();
			Engine.store.mockReturnValue({messageCenter: {}});
		});
		
		test('Message Box is rendered', () => {
			const messageBox = shallow(<MessageBox messageCenter={{MESSAGEFLAG: true, MESSAGE: []}} />);
			expect(messageBox.html()).toBeTruthy();
		});
		
		test('Confirmation Box is rendered with Yes and No buttons if functionFlag is set', () => {
			const messageBox = shallow(<MessageBox messageCenter={{MESSAGEFLAG: true, MESSAGE: [], functionFlag: true}} />);
			expect(messageBox.html()).toMatch(/execute/);
			expect(label.getLabel.mock.calls.length).toEqual(2);
		});	
		
		test('Confirmation Box Yes button is clicked, function is executed', () => {
			const messageBox = shallow(<MessageBox messageCenter={{MESSAGEFLAG: true, MESSAGE: [], functionFlag: true}} />),
				btns = messageBox.find('.func_btn');
				
			btns.at(0).simulate('click');
			expect(Helper.executeFunc).toHaveBeenCalled();
		});	
		
		test('Confirmation Box Cancel button is clicked, box is closed', () => {
			const messageBox = shallow(<MessageBox messageCenter={{MESSAGEFLAG: true, MESSAGE: [], functionFlag: true}} />),
				btns = messageBox.find('.func_btn');
				
			btns.at(1).simulate('click');
			expect(Helper.clearMessage).toHaveBeenCalled();
		});	
	});
});
