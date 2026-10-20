import { Cookies } from 'react-cookie';

const langs = {
	en: 'en',
	cn: 'cn'
} as const;

const toggles = {
	en: 'cn',
	cn: 'en'
};

type Lang = keyof typeof langs;

const options = { path: '/' };

class Session {
	#_cookies: Cookies | null = null;

	get lang() {
		return this.#_cookies? this.#_cookies?.get('lang') as Lang : langs.en;
	}

	toggleLang() {
		this.#_cookies?.set('lang', toggles[this.lang], options);
	}

	get userSignedIn() {
		return this.#_cookies?.get('userSignedIn') === '1';
	}

	set cookies(cookies: Cookies) {
		this.#_cookies = cookies;
	}
}

export const session = new Session();
