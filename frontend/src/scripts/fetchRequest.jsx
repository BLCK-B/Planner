const URL = "http://localhost:8081";

const fetchRequest = async (method, request, body = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const options = {
      method: method,
      headers: headers,
      credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(URL + request, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Backend error");
    }

    const token = await response.text();

    try {
      return JSON.parse(token);
    } catch {
      return token;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default fetchRequest;
