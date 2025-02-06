const URL = "http://localhost:8080";

const fetchPost = async (request, body) => {
  let data = null;
  let error = null;
  let loading = true;

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

    data = await response.json();
  } catch (err) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { data, loading, error };
};

export default fetchPost;
