import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserInterface } from "../../interface/user.interface";
import apiClient from "../http-config";

export interface createInterface {
  tweepId: string;
  userTags?: string;
}

export const createEndpoint = (newTag: UserInterface) => {
  return apiClient.post("/user/create", newTag);
};

export const useCreate = (toast: any) => {
  const queryClient = useQueryClient();

  return useMutation(createEndpoint, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      queryClient.invalidateQueries(["alltags"]);
    },
    onSettled: (error, variable, context) => {
      toast.success("Tag Created");
      console.log("settled?", { context });
    },
    onError: (error) => {
      toast.error("Error Creating Tag");
      console.log({ error });
    },
  });
};
