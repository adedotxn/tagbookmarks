import { useQuery } from "@tanstack/react-query";
import apiClient from "../http-config";

export const useTags = (id: string) => {
  return useQuery(["alltags", id], () => apiClient.get(`/tags/all/${id}`));
};
