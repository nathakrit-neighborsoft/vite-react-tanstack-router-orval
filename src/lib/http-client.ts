import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const httpClient = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axios(config).then((response) => response.data)
}
