import { useEffect, useState, useCallback, useRef } from "react";
import app_api_url from "../../Services/app_api_url";

const useFetchHook = (endPointName) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!endPointName) return;

    // Abort previous request if it exists
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${app_api_url}/${endPointName}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const json = await response.json();
      setResult(json.result ?? null);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endPointName]);

  useEffect(() => {
    fetchData();

    return () => abortControllerRef.current?.abort();
  }, [fetchData]);

  return {
    result,
    refetch: fetchData,
    loading,
    error,
  };
};

export default useFetchHook;
