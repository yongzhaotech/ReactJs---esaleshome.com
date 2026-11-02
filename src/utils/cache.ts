type CacheEntry = {
	time: number;
	data: unknown;
};

class _Cache {
	#_timeToLive = 1800000;
	#_maxEntries = 100;
	#_store: Map<string, CacheEntry>;

	constructor() {
		this.#_store = new Map();
	}

	get<T = unknown>(key: string): T | null {
		const entry = this.#_store.get(key);

		if (entry) {
			if (Date.now() - entry.time >= this.#_timeToLive) {
				this.#_store.delete(key);
				return null;
			}
			return this.#_clone(entry.data) as T;
		}

		return null;
	}

	key(script: string, data: Record<string, unknown> = {}): string {
		const params = Object.keys(data)
			.sort()
			.map(paramKey => [paramKey, typeof data[paramKey], data[paramKey]]);
		return JSON.stringify([script, params]);
	}

	add<T>(key: string, data: T): void {
		this.#_removeExpired();
		this.#_store.delete(key);
		this.#_store.set(key, {
			time: Date.now(),
			data: this.#_clone(data),
		});
		while (this.#_store.size > this.#_maxEntries) {
			const oldestKey = this.#_store.keys().next().value;
			if (oldestKey === undefined) {
				break;
			}
			this.#_store.delete(oldestKey);
		}
	}

	clear(): void {
		this.#_store.clear();
	}

	delete(key: string): void {
		this.#_store.delete(key);
	}

	size(): number {
		this.#_removeExpired();
		return this.#_store.size;
	}

	#_removeExpired(): void {
		const now = Date.now();
		this.#_store.forEach((entry, key) => {
			if (now - entry.time >= this.#_timeToLive) {
				this.#_store.delete(key);
			}
		});
	}

	#_clone<T>(value: T): T {
		if (value === null || typeof value !== 'object') {
			return value;
		}
		if ('then' in value && typeof value.then === 'function') {
			return value;
		}
		if (typeof structuredClone === 'function') {
			return structuredClone(value);
		}
		return JSON.parse(JSON.stringify(value)) as T;
	}
}

export const Cache = new _Cache();
