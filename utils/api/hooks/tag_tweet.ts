import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionInterface } from "../../collection.interface";
import apiClient from "../http-config";

export const createEndpoint = (newTag: CollectionInterface) => {
  return apiClient.post(`/tags/addtag/${newTag.tweepId}`, newTag);
};

export const useAddTag = () => {
  const queryClient = useQueryClient();

  return useMutation(createEndpoint, {
    onSuccess: () => {
      queryClient.invalidateQueries(["tags", "taggedtweets"]);
    },
    onSettled: (error, variable, context) => {
      console.log("settled? ", { context });
    },
    onError: (error) => {
      console.log({ error });
    },
  });
};
