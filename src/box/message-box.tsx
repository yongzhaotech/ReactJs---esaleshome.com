import React, { Component } from 'react';
import { Pager } from 'react-bootstrap';
import { getLabel } from '../common/label';
import { Helper } from '../common/js-funcs';

interface MessageCenter {
	MESSAGEFLAG: string;
	MESSAGE: string[];
	functionFlag?: boolean;
}

interface MessageBoxProps {
	messageCenter: MessageCenter;
}

class MessageBox extends Component<MessageBoxProps> {
	private messageBoxReference: HTMLDivElement | null = null;
	private closeButtonReference: HTMLDivElement | null = null;

	private createReference = (element: HTMLDivElement | null): void => {
		this.messageBoxReference = element;
		Helper.setMessageBoxReference(element);
	};

	private createCloseButtonReference = (element: HTMLDivElement | null): void => {
		this.closeButtonReference = element;
	};

	private keyPressed = (event: KeyboardEvent): void => {
		if (event.keyCode === 13) {
			this.closeButtonReference?.click();
		}
	};

	componentDidUpdate(): void {
		if (this.closeButtonReference) {
			this.closeButtonReference.onkeydown = this.keyPressed;
			this.closeButtonReference.setAttribute('tabindex', '0');
			this.closeButtonReference.focus();
		}
	}

	render() {
		const { messageCenter } = this.props;

		if (!messageCenter.MESSAGEFLAG) {
			return null;
		}

		return (
			<div className="message_wrapper box-in" ref={this.createReference}>
				<div className="closer">
					<div
						className="ang_close"
						aria-label="close this message box"
						onClick={() => Helper.clearMessage()}
						ref={this.createCloseButtonReference}
					>
						&times;
					</div>
				</div>
				<div className="message">
					{messageCenter.MESSAGE.map((message, index) => (
						<div className={messageCenter.MESSAGEFLAG} key={index}>{message}</div>
					))}
				</div>
				{messageCenter.functionFlag ? (
					<Pager>
						<div className="devider"></div>
						<Pager.Item onClick={Helper.executeFunc}>{getLabel('r_ok_btn')}</Pager.Item>{' '}
						<Pager.Item onClick={() => Helper.clearMessage()}>
							{getLabel('r_cancel_btn')}
						</Pager.Item>
					</Pager>
				) : null}
			</div>
		);
	}
}

export default MessageBox;
