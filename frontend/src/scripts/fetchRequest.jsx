const URL = "http://localhost:8081";

const fetchRequest = async (method, request, body = null) => {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (method === "POST" && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
      throw new Error("Backend error");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

export default fetchRequest;
