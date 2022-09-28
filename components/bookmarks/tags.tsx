import { Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/api/http-config";

interface TagBadgeInterface {
  tweepId: string;
  tweetId: string;
}
const TagBadge = ({ tweepId, tweetId }: TagBadgeInterface) => {
  const {
    isLoading,
    status,
    fetchStatus,
    data: returned,
  } = useQuery(
    ["badgeTags", tweepId, tweepId],
    async () => {
      const fetch = await apiClient.get(`/tags/tweet/${tweepId}/${tweetId}`);
      return fetch.data;
    },
    {
      enabled: !!tweepId && !!tweetId,
    }
  );
  const data = returned?.tags;

  if (isLoading) {
    return (
      <div>
        <p>tags are loading...</p>
      </div>
    );
  }

  if (data !== undefined && data.length !== 0) {
    return (
      <>
        {returned?.tweetId === tweetId
          ? data.map((e: string) => {
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
      </>
    );
  } else if (data.length === 0) {
    return <div>No tags on tweet</div>;
  } else {
    return (
      <div>
        <p>.</p>
      </div>
    );
  }
};

export default TagBadge;
