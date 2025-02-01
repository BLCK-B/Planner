import { useEffect, useState } from "react";

const URL = "http://localhost:8080";

const useFetch = (request) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(URL + request);
        if (!response.ok) {
          throw new Error("Backend error");
        }
        setData(await response.json());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [request]);

  return { data, loading, error };
};

export default useFetch;
