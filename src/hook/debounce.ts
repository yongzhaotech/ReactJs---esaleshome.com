import { useEffect } from 'react';

export const useDebounce = (cb: () => void, delay = 500) => {
    useEffect(() => {
        const timer = setTimeout(cb, delay);

        return () => {
            clearTimeout(timer);
        }
    }, [cb, delay]);
}