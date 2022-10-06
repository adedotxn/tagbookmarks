import { useQuery } from "@tanstack/react-query";
import apiClient from "../http-config";

export interface createInterface {
  tweepId: string;
  userTags?: string;
}

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

export const useDataGetter = (id: string) => {
  return useQuery(["tags", id], () => apiClient.get(`/user/${id}`));
};

// export const useTwitterBookmarks = async (
//   maxResults: number,
//   startSearch: boolean
// ) => {
//   const ret = useQuery(
//     ["Bookmarks", maxResults],
//     async () => {
//       const fetch = await apiClient.get(`/bookmarks/${maxResults}`);
//       console.log("fetch.data --- ", fetch.data);
//       return fetch.data;
//     },
//     {
//       retry: 4,
//       enabled: startSearch,
//     }
//   );

// };
