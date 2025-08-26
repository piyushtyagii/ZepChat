import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? 'http://localhost:5001/api' : '/api', 
  withCredentials: true, // Include credentials for CORS requests
});

//this function is basically creating the instance with same base URL so that we dojn;t have to repeat the same in every data fetching function