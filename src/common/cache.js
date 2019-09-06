let store = new Map(),
    milliSeconds = 1800000;

const Cache = {
    add: (key, json) => {
        store.set(key, {
        	time: Date.now(),
			data: json
		});
    },

	clear: () => {
		store.clear();
	},
	
	get: key => {
    	if(store.has(key)) {
    		let time = store.get(key).time,
				now = Date.now(),
				diff = now - time;

	  		return diff > milliSeconds ? null : store.get(key).data;
 		}else {
    		return null;
		}
	},

	key: (script, data = {}) => Object.keys(data).reduce((acc, cur) => `${acc}&${cur}=${data[cur]}`, script),
	
	size: () => store.size
};

export { Cache };