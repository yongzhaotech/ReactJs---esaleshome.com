type CacheEntry = {
	time: number;
	data: unknown;
};

class _Cache {
	#_milliSeconds = 1800000;
	#_store: Map<string, CacheEntry>;

	constructor() {
		this.#_store = new Map();
	}

	get<T = unknown>(key: string): T | null {
		const entry = this.#_store.get(key);

		if (entry) {
			const diff = Date.now() - entry.time;

			return diff > this.#_milliSeconds ? null : (entry.data as T);
		}

		return null;
	}

	key(script: string, data: Record<string, unknown> = {}): string {
		return Object.entries(data).reduce(
			(accumulation, [paramKey, paramValue]) => `${accumulation}&${paramKey}=${String(paramValue)}`,
			script
		);
	}

	add<T>(key: string, data: T): void {
		this.#_store.set(key, {
			time: Date.now(),
			data,
		});
	}

	clear(): void {
		this.#_store.clear();
	}

	size(): number {
		return this.#_store.size;
	}
}

export const Cache = new _Cache();
