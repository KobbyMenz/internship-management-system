import { useEffect, useState, useRef } from "react";

const useFetch = (url, autoRefreshInterval = 0) => {
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ NEW: Error state
  const controllerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // ✅ Clear previous errors

        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (json.result) {
          setData(json.result);
          setError(null);
        } else {
          throw new Error("No result in response");
        }
      } catch (err) {
        // ✅ Proper error handling (don't catch AbortError)
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err.message);
          setError(err.message);
          setData(null); // Clear stale data on error
        }
      } finally {
        setLoading(false); // ✅ Always set loading to false
      }
    };

    fetchData();

    // ✅ Setup auto-refresh interval if specified
    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, autoRefreshInterval);
    }

    // ✅ Cleanup function
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetch, url, autoRefreshInterval]); // ✅ Removed unused isFirstRender

  return {
    data,
    setRefetch,
    loading,
    error, // ✅ Export error state
  };
};

export default useFetch;
