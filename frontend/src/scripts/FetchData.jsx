import { useEffect, useState } from "react";
import { useTaskContext } from "../TaskContext.jsx";

// TODO: create fetch function for reuse
// tests... tests
const FetchData = () => {
  const { itemList, setItemList } = useTaskContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/getTasks");
        if (!response.ok) {
          throw new Error("Backend error");
        }
        const data = await response.json();
        setItemList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return { itemList, loading, error };
};

export default FetchData;
