const URL = "http://localhost:8081";

const fetchRequest = async (method, request, body = null) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method: method,
      // headers: {
      //   "Content-Type": "application/json",
      // },
      headers: headers,
      credentials: "include",
    };

    if (method === "POST" && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Backend error");
    }

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default fetchRequest;
