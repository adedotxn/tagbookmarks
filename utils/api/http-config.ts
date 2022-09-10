import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/twitter",
  headers: {
    "Content-type": "application/json",
  },
});

export default apiClient;
