import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBrandTwitter } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyBookmarks from "../components/bookmarks/empty";
import ErrorComponent from "../components/bookmarks/error";
import BookmarksPageHeader from "../components/bookmarks/header";
import AddtagModal from "../components/modal/addtag";
import CreateTagModal from "../components/modal/create_tag_modal";
import SearchAndCreate from "../components/search_and_create";
import { bookmarkPageStyle } from "../components/styles/style";
import { useTaggedGetter } from "../utils/hooks/getAllTagged";
import { useTags } from "../utils/hooks/getAllUserTags";

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
  const userId = session !== undefined && session?.user.id;
  const { data: allTags, isLoading: tagsLoading } = useTags(userId);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  // const [tagModal, setTagModal] = useState<string>("");

  // const tagInitialValues = [
  //   { value: "important", label: "Important" },
  //   { value: "funny", label: "Funny" },
  //   { value: "relatable", label: "Relatable" },
  // ];

  // const [tags, setTags] = useState<tagInterface[]>(tagInitialValues);

  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 200);

  const [openModal, setOpenModal] = useState(false);

  //getting all tweets tagged by user
  const {
    data: all,
    error,
    isLoading: taggedLoading,
  } = useTaggedGetter(userId);
  const userData = all?.data;

  const [tagId, setTagId] = useState("");
  const handleTagModal = (id: string) => {
    setTagId(id);
  };

  console.log("bare", userData?.data);

  if (all === undefined || all?.data.length === 0) {
    return (
      <>
        <div>
          <ErrorComponent error="You have not tagged any bookmarks yet 😊" />
        </div>
      </>
    );
  }

  if (error) {
    console.log("errorr", error);
    if (error instanceof Error) {
      return (
        <div>
          <ErrorComponent error={error?.message} />
        </div>
      );
    } else {
      <div>
        <ErrorComponent error="Unexpected Error" />
      </div>;
    }
  }

  if (taggedLoading) {
    console.log("loading", userData?.data);

    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!taggedLoading) {
    console.log("not loading", userData?.data);
    return (
      <div className={classes.wrapper}>
        <>
          <BookmarksPageHeader />
        </>

        <section>
          {userData?.data === undefined ? (
            <div>Loading....</div>
          ) : (
            <SearchAndCreate
              length={userData?.data.length}
              info={`Tagged: ${userData?.data.length} tweets`}
              search={search}
              setSearch={setSearch}
              setOpenModal={setOpenModal}
              placeholder="Search through tagged with username/tags"
            />
          )}

          <CreateTagModal
            openModal={openModal}
            // tags={tags}
            // setTags={setTags}
            setOpenModal={setOpenModal}
          />
        </section>

        <main>
          {userData?.data.length === 0 || userData?.data === undefined ? (
            <EmptyBookmarks />
          ) : (
            <>
              {userData?.data
                .filter((data: savedInterface) => {
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
                ?.map((data: savedInterface, index: number) => {
                  const tweetLink = data.text.slice(-24);
                  const tweet = data.text;
                  return (
                    <div key={`${data.id}${index}`}>
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

                          {tagId === data.id && (
                            <AddtagModal
                              userId={userId}
                              tagId={tagId}
                              dataId={data.id}
                              setTagId={setTagId}
                              allTags={allTags}
                              tagsLoading={tagsLoading}
                            />
                          )}

                          <section className={classes.badge}>
                            {data.tags.map((e: string) => {
                              return (
                                <Badge
                                  key={`${data.id}${index}`}
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
      <div>
        <p>default tagged</p>
      </div>
    </>
  );
};

export default Bookmarks;
