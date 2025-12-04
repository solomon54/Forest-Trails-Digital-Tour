import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // All your backend routes live here
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // allows cookies (auth)
});

export default apiClient;
