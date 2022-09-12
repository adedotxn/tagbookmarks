import { useQuery } from "@tanstack/react-query";
import apiClient from "./http-config";

export const userBkmrks = async () => {
  const fetch = await apiClient.get(`/bookmarks`);
  return fetch.data;
};

export const useBookmarks = () => {
  return useQuery(["Bookmarks"], () => apiClient.get(`/bookmarks`));
};
