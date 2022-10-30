import {
  Badge,
  Button,
  Card,
  Chip,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { savedInterface } from "../../pages/tagged";
import { useTags } from "../../utils/api/hooks/getAllUserTags";
import EmptyBookmarks from "../bookmarks/empty";
import AddtagModal from "../modal/addtag";
import { taggedCardsComponentStyle } from "../styles/taggedPage/taggedCards";

interface TaggedCardsInterface {
  userData: {
    data: any[];
  };
  toSearch: string;
  isTagError: boolean;
  tagError: unknown;
}

const TaggedCards = ({
  toSearch,
  userData,
  isTagError,
  tagError,
}: TaggedCardsInterface) => {
  /**  Fetching / Getting */
  const { data: session } = useSession();
  const { classes } = taggedCardsComponentStyle();
  const USER_ID = session !== undefined && session?.user.id;
  const { data: allTags, isLoading: tagsLoading } = useTags(USER_ID);
  const [showEmbed, setShowEmbed] = useState("");

  /** States */
  const [tagId, setTagId] = useState("");

  const handleTagModal = (id: string) => {
    setTagId(id);
  };
  const handleShowEmbed = (id: string) => {
    if (id === showEmbed) {
      setShowEmbed("shagabumm");
      return;
    }

    setShowEmbed(id);
  };

  return (
    <>
      {userData?.data.length === 0 || userData?.data === undefined ? (
        <EmptyBookmarks />
      ) : (
        <>
          {userData?.data
            .filter((data: savedInterface) => {
              if (toSearch === "") {
                return data;
              } else if (
                data.text.toLowerCase().includes(toSearch.toLowerCase()) ||
                data.username.toLowerCase().includes(toSearch.toLowerCase()) ||
                data.tags.includes(`${toSearch}`)
              ) {
                return data;
              }
            })
            ?.map((data: savedInterface, index: number) => {
              const tweetLink = data.text.slice(-24);
              const tweet = data.text;
              return (
                <Stack spacing="lg" key={`${data.id}${index}`}>
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

                      <Chip
                        mt={20}
                        checked={showEmbed === data.id}
                        onChange={() => handleShowEmbed(data.id)}
                        variant="filled"
                      >
                        {showEmbed === data.id
                          ? "Close tweet embed"
                          : "Show tweet embed"}
                      </Chip>

                      {showEmbed === data.id && (
                        <TwitterTweetEmbed
                          options={{ height: 150, theme: "dark" }}
                          tweetId={data.id}
                          placeholder={
                            <Loader mt={10} ml={10} variant="dots" />
                          }
                        />
                      )}

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

                      {tagId === data.id && (
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
                      )}

                      <section className={classes.badge}>
                        {data.tags.map((e: string) => {
                          return (
                            <Badge
                              key={e}
                              mt={15}
                              ml={6}
                              radius="sm"
                              color="pink"
                              variant="light"
                            >
                              {e}
                            </Badge>
                          );
                        })}
                      </section>
                    </Card.Section>
                  </Card>

                  {/* <TwitterTweetEmbed tweetId={data.id} /> */}
                  {/* <TweetEmbed tweetId={data.id} /> */}
                </Stack>
              );
            })}
        </>
      )}
    </>
  );
};

export default TaggedCards;
