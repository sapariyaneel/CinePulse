import { useEffect, useState, useRef, useCallback } from "react";

type UseFetchOptions = {
    autoFetch?: boolean;
    dependencies?: any[];
};

const useFetch = <T>(
    fetchFunction: () => Promise<T>,
    optionsOrAutoFetch: UseFetchOptions | boolean = true
) => {
    // Handle backward compatibility: if second param is boolean, treat it as autoFetch
    const options: UseFetchOptions = typeof optionsOrAutoFetch === 'boolean'
        ? { autoFetch: optionsOrAutoFetch, dependencies: [] }
        : { autoFetch: true, dependencies: [], ...optionsOrAutoFetch };

    const { autoFetch = true, dependencies = [] } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isMounted = useRef(true);
    const fetchFunctionRef = useRef(fetchFunction);

    // Always update the ref with the latest fetch function
    useEffect(() => {
        fetchFunctionRef.current = fetchFunction;
    });

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Stable fetchData function that doesn't change
    const fetchData = useCallback(async () => {
        try {
            if (isMounted.current) setLoading(true);
            if (isMounted.current) setError(null);

            const result = await fetchFunctionRef.current();

            if (isMounted.current) setData(result);
        } catch (err) {
            if (isMounted.current) {
                //@ts-ignore
                setError(err instanceof Error ? err : new Error('An error occurred'));
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []); // Empty deps - stable function

    const reset = useCallback(() => {
        if (isMounted.current) {
            setData(null);
            setLoading(false);
            setError(null);
        }
    }, []);

    // Auto-fetch effect
    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFetch, fetchData, ...dependencies]); // Spread dependencies here

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;