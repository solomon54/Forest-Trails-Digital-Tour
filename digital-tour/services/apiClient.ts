//services/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
  timeout: 10000,  
});

// Optional: Global error interceptor (logs + rejects)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;