import { useEffect, useState } from "react";

export function UseDebounce<T>(value: T, delay: number) {

    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(handler)
    }, [value, delay]);

    return debouncedValue;
}