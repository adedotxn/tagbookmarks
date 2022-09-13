import { useQuery } from "@tanstack/react-query";
import apiClient from "./http-config";

export const userBkmrks = async () => {
  const fetch = await apiClient.get(`/twitter/bookmarks`);
  return fetch.data;
};

export const useBookmarks = () => {
  return useQuery(["Bookmarks"], () => apiClient.get(`/twitter/bookmarks`));
};

export const userNumberedBookmarks = async (maxResults: number) => {
  const fetch = await apiClient.get(`/bookmarks/${maxResults}`);
  console.log("fetch.data -- ", fetch.data);
  return fetch.data;
};

// export const useNumberedBookmarks = (maxResults: number) => {
//   return useQuery(["Bookmarks", maxResults], () =>
//     apiClient.get(`/bookmarks/${maxResults}`)
//   );
// };
