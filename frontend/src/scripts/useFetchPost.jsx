import { useState, useEffect } from "react";

const URL = "http://localhost:8081";

const useFetchPost = (request, body) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(URL + request, options);

        if (!response.ok) {
          throw new Error("Backend error");
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [request, body]);

  return { data, loading, error };
};

export default useFetchPost;
