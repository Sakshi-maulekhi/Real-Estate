import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://real-estate-zx4p.onrender.com",
  withCredentials: true,
});

export default apiRequest;
