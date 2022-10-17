import { Button, Card, Group, Text, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBrandTwitter } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTags } from "../../utils/api/hooks/getAllUserTags";
import { BookMarkInterface } from "../../utils/interface/context.interface";
import AddtagModal from "../modal/addtag";
import { cardStyle } from "../styles/card";
import TagBadge from "./tags";

export interface BookmarkCardInteface {
  data: BookMarkInterface[];
  search: string;
  handleTagModal?: () => void;
}

export interface DataInterface {
  value: string;
  label: string;
}

const BookmarkCards = ({ data, search }: BookmarkCardInteface) => {
  /** States */
  const [tagId, setTagId] = useState("");
  const [debounced] = useDebouncedValue(search, 200);

  /**  Fetching / Getting */
  const { data: session } = useSession();
  const { classes } = cardStyle();
  const router = useRouter();
  const USER_ID: string = session?.user?.id;

  const {
    data: allTags,
    isLoading: tagsLoading,
    isError: isTagError,
    error: tagError,
  } = useTags(USER_ID);

  const handleTagModal = (id: string) => {
    setTagId(id);
  };

  return (
    <>
      {data
        .filter((data) => {
          if (debounced === "") {
            return data;
          } else if (
            data.text.toLowerCase().includes(debounced.toLowerCase()) ||
            data.username.toLowerCase().includes(debounced.toLowerCase()) ||
            data.name.toLowerCase().includes(debounced.toLowerCase())
          ) {
            return data;
          }
        })
        ?.map((data) => {
          const tweetLink = data.text.slice(-24);
          const tweet = data.text;
          return (
            <div key={`${data.id}${Math.random()}`}>
              <Card
                className={classes.cards}
                shadow="sm"
                //   p="lg"
                radius="md"
                mt={40}
                withBorder
              >
                <Card.Section className={classes.card_section}>
                  <div>
                    <Title order={3}> {data.name} </Title>
                    <Link href={`https://twitter.com/${data.username}`}>
                      <a target="blank">
                        <Text className={classes.username} weight={800}>
                          @{data.username}
                        </Text>
                      </a>
                    </Link>
                  </div>

                  <Text mt={5} weight={500} size="sm">
                    {tweet}
                  </Text>

                  {/* <TwitterTweetEmbed
                          options={{ height: 200, theme: "dark" }}
                          tweetId={data.id}
                        /> */}

                  <Group position="center" className={classes.card_btns}>
                    <Button
                      leftIcon={<IconBrandTwitter />}
                      component="a"
                      href={tweetLink}
                      target="_blank"
                      variant="light"
                      color="blue"
                      //   mt="md"
                      radius="md"
                      compact
                    >
                      Go to Tweet
                    </Button>

                    <Button
                      variant="light"
                      onClick={() => handleTagModal(data.id)}
                      color="blue"
                      radius="md"
                      compact
                    >
                      Add tag
                    </Button>
                  </Group>

                  {router.pathname.includes("bookmarks") && (
                    <TagBadge tweepId={USER_ID} tweetId={data.id} />
                  )}
                </Card.Section>
              </Card>

              {/* <TwitterTweetEmbed tweetId={data.id} /> */}
              {/* <TweetEmbed tweetId={data.id} /> */}

              <AddtagModal
                userId={USER_ID}
                tagId={tagId}
                dataId={data.id}
                setTagId={setTagId}
                allTags={allTags}
                tagsLoading={tagsLoading}
                isTagError={isTagError}
                tagError={tagError}
              />
            </div>
          );
        })}
    </>
  );
};

export default BookmarkCards;
