import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  validateStatus: (status: number) => {
    if (status >= 200 && status < 300) {
      return true;
    }

    if (status === 401 && window.location.pathname !== "/") {
      localStorage.removeItem("@AdminBizz:token");
      localStorage.removeItem("@AdminBizz:user");

      window.location.href = "";
    }

    return false;
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("@AdminBizz:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
