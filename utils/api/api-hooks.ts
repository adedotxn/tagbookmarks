import { useQuery } from "@tanstack/react-query";
import apiClient from "./http-config";

// export const userBookmarks = async () => {
//   const fetch = await apiClient.get(`/bookmarks`);
//   return fetch.data;
// };

export const useBookmarks = () => {
  return useQuery(["Bookmarks"], () => apiClient.get(`/bookmarks`));
};

// const fetcher = (url: RequestInfo | URL) =>
//   fetch(url).then((res) => res.json());

// export function useUser() {
//   const { data, error } = useSWR("/api/twitter/bookmarks", fetcher);

//   return {
//     data: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }
