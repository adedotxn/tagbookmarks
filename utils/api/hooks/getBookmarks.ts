import { useQuery } from "@tanstack/react-query";
import apiClient from "../http-config";
import { axiosApiInstance } from "../interceptor";

export interface createInterface {
  tweepId: string;
  userTags?: string;
}

export const userBkmrks = async () => {
  const fetch = await apiClient.get(`/twitter/bookmarks`);
  return fetch.data;
};

export const useBookmarks = (startSearch: boolean) => {
  return (
    useQuery(["Bookmarks"], () => axiosApiInstance.get(`/twitter/bookmarks`)),
    {
      retry: 4,
      enabled: startSearch,
    }
  );
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
