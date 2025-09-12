import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加认证token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    // 处理常见的HTTP错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，可以重定向到登录页
          console.error("Unauthorized access");
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error(
            `HTTP Error ${status}:`,
            data?.message || error.message
          );
      }
    } else if (error.request) {
      console.error("Network error:", error.message);
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// 导出配置好的axios实例
export default instance;

// 导出常用的HTTP方法
export const get = (url: string, config?: AxiosRequestConfig) =>
  instance.get(url, config);
export const post = (url: string, data?: any, config?: AxiosRequestConfig) =>
  instance.post(url, data, config);
export const put = (url: string, data?: any, config?: AxiosRequestConfig) =>
  instance.put(url, data, config);
export const patch = (url: string, data?: any, config?: AxiosRequestConfig) =>
  instance.patch(url, data, config);
export const del = (url: string, config?: AxiosRequestConfig) =>
  instance.delete(url, config);

// 类型定义
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
  details?: string;
}

// 封装常用的API调用方法
export const APIServer = {
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await instance.get(url, config);
    return response.data;
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await instance.post(url, data, config);
    return response.data;
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await instance.put(url, data, config);
    return response.data;
  },

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await instance.patch(url, data, config);
    return response.data;
  },

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await instance.delete(url, config);
    return response.data;
  },
};
