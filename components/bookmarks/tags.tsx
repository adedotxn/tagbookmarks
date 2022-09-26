import { Badge } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTweetTags } from "../../utils/api/hooks/tweet_tags";

interface TagBadgeInterface {
  tweepId: string;
  tweetId: string;
}
const TagBadge = ({ tweepId, tweetId }: TagBadgeInterface) => {
  const { isLoading, error, data: returned } = useTweetTags(tweepId, tweetId);
  const [toUse, setToUse] = useState<string[]>([]);
  const data = returned?.data;

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
        {/* adaa.map((e) => {
  e.tags.map((tags) => {
    console.log(tags)
  })
}) */}
        {toUse.map((e: string, index: number) => {
          return (
            <>
              <Badge
                key={tweetId}
                mt={15}
                ml={6}
                radius="sm"
                color="pink"
                variant="light"
              >
                {e}
              </Badge>
            </>
          );
        })}
        <br />
        <span>{toUse[1]}</span>
      </>
    );
  } else {
    return <div></div>;
  }
};

export default TagBadge;
