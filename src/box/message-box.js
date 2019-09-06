import React, { Component } from 'react';
import { Pager } from 'react-bootstrap';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

const MessageBox = class extends Component {
    constructor(props) {
        super(props);
        this.messageBoxReference = null;
		this.closeButtonReference = null;

        this.createReference = element => {
            this.messageBoxReference = element;
			Helper.setMessageBoxReference(this.messageBoxReference);
        };
		
		this.createCloseButtonReference= element => {
            this.closeButtonReference = element;
        };
    }
	
	keyPressed = e => {
		if(e.keyCode === 13) {
			this.closeButtonReference.click();
		}
	};

	componentDidUpdate() {
		if(this.closeButtonReference) {
			this.closeButtonReference.onkeydown = this.keyPressed;
			this.closeButtonReference.setAttribute('tabindex', 0);
			this.closeButtonReference.focus();
		}
	}
	
    render() {
		if(!this.props.messageCenter.MESSAGEFLAG) {
			return null;
		}

		return (
			<div className="message_wrapper box-in" ref = {this.createReference}>
				<div className="closer">
					<div className="ang_close" aria-label="close this message box" onClick={() => {Helper.clearMessage(this.messageBoxReference)}} ref = {this.createCloseButtonReference}>&times;</div>
				</div>
				<div className="message">
					{this.props.messageCenter.MESSAGE.map((e, i) => (<div className={this.props.messageCenter.MESSAGEFLAG} key={i}>{e}</div>))}
				</div>
				{
					this.props.messageCenter.functionFlag ?
					(
						<Pager>
							<div className='devider'></div>
							<Pager.Item onClick={Helper.executeFunc}>{getLabel('r_ok_btn')}</Pager.Item>{' '}
							<Pager.Item onClick={() => {Helper.clearMessage(this.messageBoxReference)}}>{getLabel('r_cancel_btn')}</Pager.Item>
						</Pager>
					) : null
				}
			</div>
		);
	};
};

export default MessageBox;
