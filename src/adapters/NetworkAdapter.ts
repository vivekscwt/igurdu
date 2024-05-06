import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import LoggerLib from '../libs/Logger.Lib';



export default class NetworkAdapter {
  constructor(public baseUrl?: string, public config?: AxiosRequestConfig) {}

  getConfig(headers: { [key: string]: string; } = {}): AxiosRequestConfig {
    const config = {
      baseURL: this.baseUrl,
      ...this.config,
      headers: {
        ...(this.config?.headers || {}),
        ...headers
      },
      timeout: 60_000
    };
    config.headers['content-type'] = config.headers['content-type'] || 'application/json';
    config.headers['accept-encoding'] = config.headers['accept-encoding'] || 'identity';
    return config;
  }

  public async get<T = any>(url: string, headers: { [key: string]: string; } = {}): Promise<T> {
    try {
      LoggerLib.log(`Request GET ${this.baseUrl} ${url}`)
      const response = await axios.get<T, AxiosResponse<T>>(`${url}`, this.getConfig(headers));
      LoggerLib.log(`Response GET ${this.baseUrl} ${url}`, response.data)
      return response.data;
    } catch (error: any) {
      LoggerLib.error(error.message, error?.response?.data)
      throw error;
    }
  }

  public async post<T = any, V = any>(url: string, data: T, headers: { [key: string]: string; } = {}): Promise<V> {
    try {
      LoggerLib.log(`Request POST ${this.baseUrl} ${url}`, data)
      const response = await axios.post<T, AxiosResponse<V>>(`${url}`, data, this.getConfig(headers));
      LoggerLib.log(`Response POST ${this.baseUrl} ${url}`, response.data)
      return response.data;
    } catch (error: any) {
      LoggerLib.error(error.message, error?.response?.data)
      throw error;
    }
  }
}