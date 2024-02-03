import axios, { AxiosError } from "axios";
import { RoutePath } from "./constants";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api/v1";

export async function authenticatedGet<T>(path: string, bearerToken: string, navigate: (path: string) => void) {
  try {
    const res = await axios.get<T>(API_BASE_URL + path, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    return res;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) navigate(RoutePath.ROOT);
    }
    throw e;
  }
}

export async function authenticatedPost(path: string, data: any, bearerToken: string) {
  return axios.post(API_BASE_URL + path, data, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
}

export async function authenticatedPut(path: string, data: any, bearerToken: string) {
  return axios.put(API_BASE_URL + path, data, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
}
