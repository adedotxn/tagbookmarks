import { useQuery } from "@tanstack/react-query";
import apiClient from "../http-config";

export const useTweetTags = (tweepId: string, tweetId: string) => {
  return useQuery(["specific_tags", tweepId, tweepId], () =>
    apiClient.get(`/tags/tweet/${tweepId}/${tweetId}`)
  );
};
