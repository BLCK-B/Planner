const URL = "http://localhost:8081";

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";

const fetchRequest = async (method: Methods, request: string, body?: object | null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
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
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(String(err));
    }
  }
};

export default fetchRequest;
