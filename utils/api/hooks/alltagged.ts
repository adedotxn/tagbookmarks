import { useQuery } from "@tanstack/react-query";
import apiClient from "../http-config";

export const useTaggedGetter = (id: string) => {
  return useQuery(["tags", id], () => apiClient.get(`/tags/${id}`));
};
