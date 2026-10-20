type Params = Record<string, string> | null;

type History = {
	location: { pathname: string };
	push(location: { pathname: string }): void;
	goBack(): void;
} | null;

class Route {
	#_params: Params = null;
	#_history: History = null;

	get params() {
		return this.#_params;
	}

	set params(params: Params) {
		this.#_params = params;
	}

	get history() {
		return this.#_history;
	}

	set history(history: History) {
		this.#_history = history;
	}

	location(path?: string) {
		if (!this.#_history) {
			throw new Error('Router history has not been registered');
		}
		this.#_history.push({
			pathname: path ? `/ads/${path}` : `/ads`,
		});
	}

	goBack() {
		if (!this.#_history) {
			throw new Error('Router history has not been registered');
		}
		this.#_history.goBack();
	}

	path() {
		if (!this.#_history) {
			throw new Error('Router history has not been registered');
		}
		return this.#_history.location.pathname;
	}

	pathName() {
		return this.#_history ? this.#_history.location.pathname || 'unknown' : 'unknown';
	}
}

export const route = new Route();
