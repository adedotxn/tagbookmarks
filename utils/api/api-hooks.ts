import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInterface } from "../user.interface";
import apiClient from "./http-config";

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

export const createEndpoint = (newTag: UserInterface) => {
  return apiClient.post("/user/create", newTag);
};

export const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation(createEndpoint, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
    },
    onSettled: (error, variable, context) => {
      console.log("settled? error", { context });
    },
    onError: (error) => {
      console.log({ error });
    },
  });
};

export const useDataGetter = (id: string) => {
  return useQuery(["tags", id], () => apiClient.get(`/user/${id}`));
};
