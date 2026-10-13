interface CacheEntry {
	time: number;
	data: unknown;
}

const store = new Map<string, CacheEntry>(),
	milliSeconds = 1800000;

const Cache = {
	add<T>(key: string, data: T): void {
		store.set(key, {
			time: Date.now(),
			data
		});
	},

	clear(): void {
		store.clear();
	},

	get<T = unknown>(key: string): T | null {
		const entry = store.get(key);

		if (entry) {
			const diff = Date.now() - entry.time;

			return diff > milliSeconds ? null : entry.data as T;
		}

		return null;
	},

	key(script: string, data: Record<string, unknown> = {}): string {
		return Object.keys(data).reduce(
			(acc, cur) => `${acc}&${cur}=${String(data[cur])}`,
			script
		);
	},

	size(): number {
		return store.size;
	}
};

export { Cache };
