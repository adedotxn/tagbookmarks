import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBrandTwitter } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyBookmarks from "../components/bookmarks/empty";
import BookmarksPageHeader from "../components/bookmarks/header";
import CreateTagModal from "../components/create_tag_modal";
import AddtagModal from "../components/modal/addtag";
import SearchAndCreate from "../components/search_and_create";
import { bookmarkPageStyle } from "../components/styles/style";
import { useActiveBookmarks } from "../utils/context";
import { useTaggedGetter } from "../utils/hooks/getAllTagged";

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
  const [debounced] = useDebouncedValue(search, 200);

  const [openModal, setOpenModal] = useState(false);

  const { activeBookmarks } = useActiveBookmarks();

  const userId = session !== undefined && session?.user.id;

  //getting all tweets tagged by user
  const { data: all, error, status, isLoading } = useTaggedGetter(userId);
  const userData = all?.data;

  const [allSaved, setAllSaved] = useState<savedInterface[]>([]);

  useEffect(() => {
    if (all !== undefined) {
      if (all.data !== undefined) {
        setAllSaved(userData.data);
      }
    }
  }, [all, userData]);

  const [tagId, setTagId] = useState("");
  const handleTagModal = (id: string) => {
    setTagId(id);
  };

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isLoading) {
    return (
      <div className={classes.wrapper}>
        <>
          <BookmarksPageHeader />
        </>

        <section>
          {allSaved === undefined ? (
            <div>Loading....</div>
          ) : (
            <SearchAndCreate
              length={allSaved.length}
              info={`Tagged: ${allSaved.length} tweets`}
              search={search}
              setSearch={setSearch}
              setOpenModal={setOpenModal}
              placeholder="Search through tagged with username/tags"
            />
          )}

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
              {allSaved
                .filter((data) => {
                  if (debounced === "") {
                    return data;
                  } else if (
                    data.text.toLowerCase().includes(debounced.toLowerCase()) ||
                    data.username
                      .toLowerCase()
                      .includes(debounced.toLowerCase()) ||
                    data.tags.includes(`${debounced}`)
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

                          <Group
                            position="center"
                            className={classes.card_btns}
                          >
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

                          <AddtagModal
                            userId={userId}
                            tagId={tagId}
                            dataId={data.id}
                            setTagId={setTagId}
                          />

                          <section className={classes.badge}>
                            {data.tags.map((e: string) => {
                              return (
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
                              );
                            })}
                          </section>
                        </Card.Section>
                      </Card>

                      {/* <TwitterTweetEmbed tweetId={data.id} /> */}
                      {/* <TweetEmbed tweetId={data.id} /> */}
                    </div>
                  );
                })}
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <>
      <div> . </div>
    </>
  );
};

export default Bookmarks;
