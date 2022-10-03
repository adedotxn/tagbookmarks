import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/http-config";

/**
 * get all the tweets that have been tagged by a user
 * used in the page that shows only the tweets they've saved by tagging
 */
export const useTaggedGetter = (id: string) => {
  return useQuery(["tags", id], () => apiClient.get(`/tags/${id}`));
};
