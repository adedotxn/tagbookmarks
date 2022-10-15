import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionInterface } from "../../interface/collection.interface";
import apiClient from "../http-config";

/**
 * add new tag to tweet
 */
export const createEndpoint = (newTag: CollectionInterface) => {
  return apiClient.post(`/tags/addtag/${newTag.tweepId}`, newTag);
};

export const useAddTag = (toast: any) => {
  const queryClient = useQueryClient();

  return useMutation(createEndpoint, {
    onSuccess: () => {
      queryClient.invalidateQueries(["specific_tags"]);
      queryClient.invalidateQueries(["tags"]);
      queryClient.invalidateQueries(["taggedtweets"]);
      queryClient.invalidateQueries(["badgeTags"]);
    },
    onSettled: (error, variable, context) => {
      toast.success("Tag Added");
      console.log("settled? ", { context });
    },
    onError: (error) => {
      console.log({ error });
    },
  });
};
