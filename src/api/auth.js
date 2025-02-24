import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData,  {withCredentials:true});
};

export const login = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData, {withCredentials:true});
};