import axios from "axios";
import { getSessionId } from "../utils/session";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-session-id"] = getSessionId();
  return config;
});

export default api;
