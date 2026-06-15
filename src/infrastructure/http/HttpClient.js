import axios from "axios";
import { API_CONFIG } from "../../config/constants";

/**
 * Cliente HTTP centralizado - facilita testes e configuração
 * Princípio: Single Responsibility
 */
export class HttpClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._setupInterceptors();
  }

  _setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Aqui você pode adicionar tokens, etc
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("HTTP Error:", errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  async get(url, config) {
    return this.client.get(url, config);
  }

  async post(url, data, config) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config) {
    return this.client.put(url, data, config);
  }

  async delete(url, config) {
    return this.client.delete(url, config);
  }
}
