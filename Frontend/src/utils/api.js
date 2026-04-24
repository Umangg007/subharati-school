const envBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = envBase !== undefined ? envBase : "http://localhost:5000";

const buildUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE}${path}`;
};

const resolveMediaUrl = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }

  // Handle absolute URLs that point to localhost (Legacy Fix)
  if (path.includes("localhost:5000")) {
    return path.replace(/^https?:\/\/localhost:5000/, API_BASE);
  }

  // If it's already a full external URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Prepend API_BASE to relative paths (e.g. /uploads/...)
  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }

  return path;
};

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

const apiRequest = async (path, { method = "GET", body, auth = false, headers = {} } = {}) => {
  const finalHeaders = { ...headers };
  if (body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      message = errorData.message || message;
      if (errorData.errors && errorData.errors.length > 0) {
        message = `${message}: ${errorData.errors.join(' • ')}`;
      }
    } catch (err) {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export { API_BASE, apiRequest, getAuthToken, setAuthToken, resolveMediaUrl };
