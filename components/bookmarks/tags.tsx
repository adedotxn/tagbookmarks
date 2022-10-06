import { Badge } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import apiClient from "../../utils/api/http-config";

interface TagBadgeInterface {
  tweepId: string;
  tweetId: string;
}
const TagBadge = ({ tweepId, tweetId }: TagBadgeInterface): JSX.Element => {
  const mockArray = [
    {
      twpId: tweepId,
      twtId: tweetId,
    },
  ];

  const tagQueries = useQueries({
    queries: mockArray.map((user) => {
      return {
        queryKey: ["badgeTags", user.twpId, user.twtId],
        queryFn: async () => {
          const fetch = await apiClient.get(
            `/tags/tweet/${user.twpId}/${user.twtId}`
          );
          return fetch.data;
        },
      };
    }),
  });

  let isLoading = tagQueries[0]?.isLoading;
  const returned = tagQueries[0]?.data;
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
                <div key={e}>
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
