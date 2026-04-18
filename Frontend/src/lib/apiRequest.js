import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://real-estate-zx4p.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
