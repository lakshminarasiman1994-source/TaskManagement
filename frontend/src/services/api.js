import axios from "axios";

const api = axios.create({
    baseURL: "https://taskmanagement-rgp0.onrender.com",
});

export default api;