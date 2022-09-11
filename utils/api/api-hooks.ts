import { useQuery } from "@tanstack/react-query";
import apiClient from "./http-config";

export const useBookmarks = () => {
  return useQuery(["Bookmarks"], () => apiClient.get(`/bookmarks`));
};
