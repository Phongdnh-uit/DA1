import axios, { AxiosError, type AxiosRequestConfig } from "axios";

const BACKEND_URL = "http://localhost:8080/";

const axiosInstance = axios.create({
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
  baseURL: BACKEND_URL,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
//     if (token && !publicEndpoints.includes(config.url || "")) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );
//
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response?.status === 401 &&
//       error.response?.data?.error?.errorCode === 1002 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
//       if (refreshToken) {
//         try {
//           const data = await refreshTokenFn({ refreshToken });
//           if (data?.data) {
//             const { accessToken, refreshToken: newRefreshToken } = data.data;
//             if (!accessToken || !newRefreshToken) {
//               throw new Error("Invalid tokens");
//             }
//             localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
//             localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, newRefreshToken);
//
//             originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//             return axiosInstance(originalRequest);
//           }
//         } catch {
//           localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
//           localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
//           window.location.href = "/auth/login";
//           return Promise.reject(error);
//         }
//       }
//       window.location.href = "/auth/login";
//     }
//     if (error.response?.status === 401) {
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   },
// );
//
export const axiosInstanceFn = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
    ...options,
  }).then(({ data }) => data);

  // @ts-expect-error: Property 'cancel' does not exist on type 'Promise<T>'.
  promise.cancel = () => {
    source.cancel("Request canceled");
  };
  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
//
// const publicEndpoints = [
//   "/auth/login",
//   "/auth/register",
//   "/auth/refresh",
//   "/auth/verify-email",
//   "/auth/forgot-password",
//   "/auth/reset-password",
//   "/auth/registration/send-email",
//   "/oauth2/**",
//   "/2fa/verify-totp",
// ];
