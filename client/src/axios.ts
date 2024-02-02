import axios from "axios";

export const API_BASE_URL = import.meta.env.API_BASE_URL || "http://127.0.0.1:3000";

export async function authenticatedGet<T>(path: string, bearerToken: string) {
  return axios.get<T>(API_BASE_URL + path, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
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
