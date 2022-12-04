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

export const useBookmarks = (
  USER_ID: string,
  noOfBookmarks: number,
  startSearch: boolean
) => {
  return useQuery(
    ["Bookmarks", noOfBookmarks],
    async () => {
      const fetch = await apiClient.get(
        `/bookmarks/${USER_ID}/${noOfBookmarks}`
      );
      console.log("fetch.data --- ", fetch.status);
      return fetch.data;
    },
    {
      retry: 5,
      enabled: startSearch,
    }
  );
};

export const useAllBookmarks = (id: string, gettingAll: boolean) => {
  return useQuery(
    ["allBookmarks"],
    () => apiClient.get(`/all/bookmarks/${id}`),
    {
      retry: 4,
      enabled: gettingAll,
    }
  );
};

// export const userNumberedBookmarks = async (maxResults: number) => {
//   const fetch = await apiClient.get(`/bookmarks/${maxResults}`);
//   console.log("fetch.data -- ", fetch.data);
//   return fetch.data;
// };

export const useDataGetter = (id: string) => {
  return useQuery(["tags", id], () => apiClient.get(`/user/${id}`));
};
