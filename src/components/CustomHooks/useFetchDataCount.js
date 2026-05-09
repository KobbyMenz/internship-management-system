import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import app_api_url from "../../app_api_url";

//========Fetching Data Count from Database (Enhanced with Caching, Retry & Abort) ============
const useFetchDataCount = (
  apiEndPointName,
  dataProperty = "totalCount",
  options = {},
) => {
  // Destructure options with defaults
  const {
    params = {},
    retries = 2,
    timeout = 10000,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    defaultValue = 0,
  } = options;

  const [dataResult, setDataResult] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const lastFetchRef = useRef(null);

  const generateCacheKey = useCallback(() => {
    return `${apiEndPointName}_${JSON.stringify(params)}_${dataProperty}`;
  }, [apiEndPointName, params, dataProperty]);

  const fetchData = useCallback(async () => {
    // Skip if no endpoint
    if (!apiEndPointName?.trim()) {
      setError("API endpoint is required");
      setLoading(false);
      return;
    }

    const cacheKey = generateCacheKey();
    const now = Date.now();

    // Check cache
    const cached = cacheRef.current.get(cacheKey);
    if (cached && now - cached.timestamp < cacheTime) {
      setDataResult(cached.data);
      setError(null);
      setLoading(false);
      return;
    }

    // Cleanup previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    let attempts = 0;

    while (attempts <= retries) {
      try {
        setLoading(true);
        const response = await axios.get(`${app_api_url}/${apiEndPointName}`, {
          params,
          timeout,
          signal: abortControllerRef.current.signal,
        });

        const value = response.data?.[dataProperty] ?? defaultValue;

        // Cache successful response
        cacheRef.current.set(cacheKey, { data: value, timestamp: now });

        setDataResult(value);
        setError(null);
        lastFetchRef.current = now;
        break;
      } catch (err) {
        if (axios.isCancel(err)) {
          //console.log("Request cancelled");
          return;
        }

        attempts++;
        if (attempts <= retries) {
          console.warn(`Retry attempt ${attempts} for ${apiEndPointName}`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        } else {
          setError(err.message || "Failed to fetch data");
          setDataResult(defaultValue);
          console.error("Failed fetching data", err);
        }
      } finally {
        setLoading(false);
      }
    }
  }, [
    apiEndPointName,
    dataProperty,
    params,
    retries,
    timeout,
    cacheTime,
    defaultValue,
    generateCacheKey,
  ]);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  return {
    dataResult,
    loading,
    error,
    refetch: fetchData, // Manual refetch
    clearCache: () => cacheRef.current.clear(), // Clear cache
  };
};

export default useFetchDataCount;
