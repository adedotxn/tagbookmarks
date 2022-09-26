import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyBookmarks from "../components/bookmarks/empty";
import BookmarksPageHeader from "../components/bookmarks/header";
import CreateTagModal from "../components/create_tag_modal";
import SearchAndCreate from "../components/search_and_create";
import { bookmarkPageStyle } from "../components/styles/style";
import { useTaggedGetter } from "../utils/api/hooks/alltagged";
import { useActiveBookmarks } from "../utils/context";

export interface tagInterface {
  label: string;
  value: string;
}

export interface savedInterface {
  id: string;
  name: string;
  tags: string[];
  text: string;
  username: string;
}

const Bookmarks = () => {
  const { classes } = bookmarkPageStyle();
  const { data: session } = useSession();

  // const [tagModal, setTagModal] = useState<string>("");

  const tagInitialValues = [
    { value: "important", label: "Important" },
    { value: "funny", label: "Funny" },
    { value: "relatable", label: "Relatable" },
  ];
  const [tags, setTags] = useState<tagInterface[]>(tagInitialValues);

  // const handleTagModal = (id: string) => {
  //   setTagModal(id);
  // };

  const [search, setSearch] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);

  const { activeBookmarks } = useActiveBookmarks();
  const allUserTags: string[] = ["Funny", "Wild"];

  const userId = session !== undefined && session?.user.id;

  const { data: all, error, status, isLoading } = useTaggedGetter(userId);
  const userData = all?.data;
  console.log("all", userData);

  const [allSaved, setAllSaved] = useState<savedInterface[]>([]);

  useEffect(() => {
    if (all !== undefined) {
      if (all.data !== undefined) {
        setAllSaved(userData.data);
      }
    }
  }, [all, userData]);

  console.log(allSaved);

  return (
    <div className={classes.wrapper}>
      <>
        <BookmarksPageHeader />
      </>

      <section>
        <SearchAndCreate
          length={allSaved.length}
          info={`Tagged: ${allSaved.length} tweets`}
          search={search}
          setSearch={setSearch}
          setOpenModal={setOpenModal}
        />

        <CreateTagModal
          openModal={openModal}
          tags={tags}
          setTags={setTags}
          setOpenModal={setOpenModal}
        />
      </section>

      <main>
        {allSaved.length === 0 || allSaved === undefined ? (
          <EmptyBookmarks />
        ) : (
          <>
            {allSaved.map((data) => {
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

                        {/* <Button
                          variant="light"
                          onClick={() => handleTagModal(data.id)}
                          color="blue"
                          radius="md"
                          compact
                        >
                          Add tag
                        </Button> */}

                        {data.tags.map((e: string) => {
                          return (
                            <Group key={data.id}>
                              <Badge
                                key={data.id}
                                mt={15}
                                ml={6}
                                radius="sm"
                                color="pink"
                                variant="light"
                              >
                                {e}
                              </Badge>
                            </Group>
                          );
                        })}
                      </Group>
                    </Card.Section>
                  </Card>

                  {/* <TwitterTweetEmbed tweetId={data.id} /> */}
                  {/* <TweetEmbed tweetId={data.id} /> */}
                </div>
              );
            })}
            {/* {allSaved.map((e, index) => {
              return e.tags.map((tag) => {
                return (
                  <Badge
                    key={index}
                    mt={15}
                    ml={6}
                    radius="sm"
                    color="pink"
                    variant="light"
                  >
                    {tag}
                  </Badge>
                );
              });
            })} */}
          </>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
