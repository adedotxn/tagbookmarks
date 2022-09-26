import { Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import apiClient from "../../utils/api/http-config";

interface TagBadgeInterface {
  tweepId: string;
  tweetId: string;
}
const TagBadge = ({ tweepId, tweetId }: TagBadgeInterface) => {
  // const { isLoading, error, data: returned } = useTweetTags(tweepId, tweetId);
  const [toUse, setToUse] = useState<string[]>([]);
  // const data = returned?.data;

  const {
    isLoading,
    status,
    fetchStatus,
    data: returned,
  } = useQuery(
    ["tags", tweepId, tweepId],
    async () => {
      const fetch = await apiClient.get(`/tags/tweet/${tweepId}/${tweetId}`);
      return fetch.data;
    },
    {
      enabled: !!tweepId && !!tweetId,
    }
  );
  console.log("condition", returned);
  const data = returned;

  useEffect(() => {
    if (data !== undefined) {
      if (data.tags !== undefined) {
        const tags =
          data.tags !== undefined &&
          data.tags.map((tag: string) => {
            return tag;
          });

        setToUse(tags);
        console.log("this tag", tags);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <p>tags are loading...</p>
      </div>
    );
  }

  if (data !== undefined && data.tags.length !== 0) {
    return (
      <>
        {/* {tweepId === data.tweetId && */}
        {returned.tweetId === tweetId
          ? returned.tags.map((e: string) => {
              return (
                <div key={tweetId}>
                  <Badge
                    mt={15}
                    ml={6}
                    radius="sm"
                    color="pink"
                    variant="light"
                  >
                    {e}
                  </Badge>
                </div>
              );
            })
          : []}
        <br />
        {/* <span>{toUse[1]}</span> */}
      </>
    );
  } else {
    return <div></div>;
  }
};

export default TagBadge;
