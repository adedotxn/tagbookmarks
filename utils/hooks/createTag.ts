import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/http-config";
import { UserInterface } from "../user.interface";

export interface createInterface {
  tweepId: string;
  userTags?: string;
}

export const createEndpoint = (newTag: UserInterface) => {
  return apiClient.post("/user/create", newTag);
};

export const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation(createEndpoint, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      queryClient.invalidateQueries(["alltags"]);
    },
    onSettled: (error, variable, context) => {
      console.log("settled?", { context });
    },
    onError: (error) => {
      console.log({ error });
    },
  });
};