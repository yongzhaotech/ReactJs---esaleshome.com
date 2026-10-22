import React from 'react';
import AdvertiseContact from './advertise-contact';
import ContactUs from './contact-us';
import EmailFriendBox from './email-friend-box';
import FindVisitorAdBox from './find-visitor-ad-box';
import ForgetPasswordBox from './forget-password-box';
import LoginBox from './login-box';
import Register from './register';
import SearchBox from './search-box';

export const Boxes: Record<string, () => JSX.Element> = {
	ask_poster: () => <AdvertiseContact />,
	contact_us: () => <ContactUs />,
	email_friend: () => <EmailFriendBox />,
	find_visitor_ad: () => <FindVisitorAdBox />,
	forget_password: () => <ForgetPasswordBox />,
	login: () => <LoginBox />,
	register: () => <Register />,
	search: () => <SearchBox />,
};
