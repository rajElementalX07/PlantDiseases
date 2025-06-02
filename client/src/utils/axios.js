import axios from "axios";


//const BASE_URL = "https://calculator.adaptable.app";
const BASE_URL = "https://plant-diseases-zj7a.onrender.com"
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;