import React, { useCallback, useEffect, useRef } from 'react';
import { Helper } from '../common/js-funcs';
import { useLocalizationContext } from '../context/localization-context';

interface MessageCenter {
	MESSAGEFLAG: string;
	MESSAGE: string[];
	functionFlag?: boolean;
}

interface MessageBoxProps {
	messageCenter: MessageCenter;
}

const MessageBox = ({ messageCenter }: MessageBoxProps) => {
	const closeButtonReference = useRef<HTMLDivElement | null>(null);
	const { getLocalizedLabel } = useLocalizationContext();
	const createReference = useCallback((element: HTMLDivElement | null) => {
		Helper.setMessageBoxReference(element);
	}, []);

	useEffect(() => {
		const closeButton = closeButtonReference.current;
		if (closeButton) {
			closeButton.setAttribute('tabindex', '0');
			closeButton.focus();
		}
	});

	if (!messageCenter.MESSAGEFLAG) {
		return null;
	}

	return (
		<div className='message_wrapper box-in' ref={createReference}>
			<div className='closer'>
				<div
					className='ang_close'
					aria-label='close this message box'
					onClick={() => Helper.clearMessage()}
					onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
						if (event.keyCode === 13) {
							closeButtonReference.current?.click();
						}
					}}
					ref={closeButtonReference}
				>
					&times;
				</div>
			</div>
			<div className='message'>
				{messageCenter.MESSAGE.map((message, index) => (
					<div className={messageCenter.MESSAGEFLAG} key={index}>
						{message}
					</div>
				))}
			</div>
			{messageCenter.functionFlag ? (
				<>
					<div className='devider'></div>
					<ul className='pager'>
						<li>
							<button type='button' className='pager-button' onClick={Helper.executeFunc}>
								{getLocalizedLabel('r_ok_btn')}
							</button>
						</li>
						<li>
							<button type='button' className='pager-button' onClick={() => Helper.clearMessage()}>
								{getLocalizedLabel('r_cancel_btn')}
							</button>
						</li>
					</ul>
				</>
			) : null}
		</div>
	);
};

export default MessageBox;
