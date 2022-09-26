import { Button, Card, Group, Modal, MultiSelect, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBrandTwitter } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAddTag } from "../../utils/api/hooks/tag_tweet";
import { BookMarkInterface } from "../../utils/interface";
import { bookmarkPageStyle } from "../styles/style";
import TagBadge from "./tags";

export interface BookmarkCardInteface {
  data: BookMarkInterface[];
  tags: string[];
  search: string;
  handleTagModal?: () => void;
}

export interface DataInterface {
  value: string;
  label: string;
}

const BookmarkCards = ({ data, tags, search }: BookmarkCardInteface) => {
  const [debounced] = useDebouncedValue(search, 200);
  const { classes } = bookmarkPageStyle();
  const router = useRouter();
  const [tagId, setTagId] = useState("");
  const [value, setValue] = useState<string[]>([]);

  const handleTagModal = (id: string) => {
    setTagId(id);
  };

  // console.log("taggs", tags[0]);
  // console.log("value", value);

  const dataForMultiSelect = Array.isArray(tags[0])
    ? tags[0].map((e) => {
        return {
          value: e,
          label: e,
        };
      })
    : [];

  const { data: session } = useSession();
  const userId: string = session?.user?.id;
  const addTagMutation = useAddTag();

  const onTagClose = (id: string) => {
    setTagId("shagabum");

    addTagMutation.mutate({
      tweepId: userId,
      tweetId: id,
      tags: value,
    });
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
            <div key={data.id}>
              <Card
                className={classes.cards}
                shadow="sm"
                //   p="lg"
                radius="md"
                mt={40}
                withBorder
              >
                <Card.Section className={classes.card_section}>
                  <Group>
                    <Link href={`https://twitter.com/${data.username}`}>
                      <a target="blank">
                        <Text className={classes.username} weight={800}>
                          @{data.username}
                        </Text>
                      </a>
                    </Link>
                  </Group>

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
                    <TagBadge
                      key={data.id}
                      tweepId={userId}
                      tweetId={data.id}
                    />
                  )}
                </Card.Section>
              </Card>

              {/* <TwitterTweetEmbed tweetId={data.id} /> */}
              {/* <TweetEmbed tweetId={data.id} /> */}

              <Modal
                opened={tagId === data.id}
                onClose={() => setTagId("shagabum")}
                title="Select a tag"
              >
                <MultiSelect
                  value={value}
                  onChange={setValue}
                  data={dataForMultiSelect}
                  label="Select tag to add"
                />

                <Group position="center">
                  <Button //*the data.id is the tweet id
                    onClick={() => onTagClose(data.id)}
                    variant="default"
                  >
                    Add Tag
                  </Button>
                </Group>
              </Modal>
            </div>
          );
        })}
    </>
  );
};

export default BookmarkCards;
