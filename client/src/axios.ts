import axios from "axios";

export async function authenticatedGet(url: string, bearerToken: string) {
  return axios.get(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
}

export async function authenticatedPut(url: string, data: any, bearerToken: string) {
  return axios.put(url, data, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
}
