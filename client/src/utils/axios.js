import axios from "axios";


//const BASE_URL = "https://calculator.adaptable.app";
const BASE_URL = "http://localhost:5000"
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;