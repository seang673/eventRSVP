import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // 1. Attach JWT
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Strip suspicious extension headers
    const forbiddenHeaders = [
      "x-chrome-extension",
      "x-firefox-extension",
      "x-edge-extension",
      "extension-id",
      "chrome-extension-id",
      "fetch-rewards-extension",
      "sec-fetch-site",
    ];

    forbiddenHeaders.forEach((h) => {
      if (config.headers[h]) delete config.headers[h];
    });

    // 3. Normalize URL (remove trailing slash)
    if (config.url.endsWith("/")) {
      config.url = config.url.slice(0, -1);
    }

    // 4. Force clean caching
    config.headers["Cache-Control"] = "no-store";
    config.headers["Pragma"] = "no-cache";

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // -----------------------------
    // 1. HANDLE TOKEN REFRESH
    // -----------------------------
    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("refresh")
    ) {
      original._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");

        // Use FULL URL or api instance
        const res = await axios.post(
          "http://localhost:8080/api/token/refresh",
          { refresh: refreshToken }
        );

        localStorage.setItem("token", res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;

        return api(original);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
      }
    }

    // -----------------------------
    // 2. HANDLE EXTENSION INTERFERENCE
    // -----------------------------
    const extensionInterference =
      error.message?.includes("message channel closed") ||
      error.message?.includes("A listener indicated an asynchronous response")

    if (extensionInterference && !original._retry) {
      original._retry = true;

      original.headers["Cache-Control"] = "no-store";
      original.headers["Pragma"] = "no-cache";

      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;

