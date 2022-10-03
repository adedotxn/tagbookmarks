import {
  ActionIcon,
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Input,
  Modal,
  MultiSelect,
  Skeleton,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTwitter, IconSearch, IconSun } from "@tabler/icons";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useBookmarks, userBkmrks } from "../utils/hooks/api-hooks";
import { BookMarkInterface } from "../utils/interface";
import { authOptions } from "./api/auth/[...nextauth]";

interface tagInterface {
  tweetId: string;
  label: string;
  value: string;
}
const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",

    header: {
      display: "flex",
      placeItems: "center",
      justifyContent: "space-between",
      padding: ".1rem 1.5rem .2rem 1.5rem",
      margin: 0,
      borderBottom: `1px solid grey,`,
      width: "100vw",

      h1: {
        padding: 0,
        // margin: "0 .3rem 0 4rem",
        textTransform: "uppercase",
        fontSize: "1.5rem",
        background: theme.fn.gradient({
          from: "blue",
          to: "teal",
          deg: 20,
        }),
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      [`& .${getRef("child")}`]: {
        fontSize: theme.fontSizes.xs,
      },

      [`& .${getRef("cards")}`]: {
        width: "40vw",
      },
    },
  },

  avi: {
    // marginLeft: "1rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",

    span: {
      marginLeft: ".5rem",
    },
  },

  login_btn: {
    textTransform: "uppercase",
    ...theme.fn.focusStyles(),

    "&:hover": {
      backgroundColor: theme.fn.darken("#00acee", 0.05),
    },
  },

  cards: {
    ref: getRef("cards"),
    width: "80vw",
  },

  skeleton: {
    display: "grid",
    placeItems: "center",
  },

  search_section: {
    position: "fixed",
    top: "4rem",
    zIndex: 3,
    background: "transparent",
    width: "100vw",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",

    div: {
      display: "grid",
      placeItems: "center",

      input: {
        width: "60vw",
      },
    },
  },
}));

const User = () => {
  const { classes } = useStyles();
  const matches = useMediaQuery("(max-width: 700px)", true, {
    getInitialValueInEffect: false,
  });

  const [tagModal, setTagModal] = useState<string>("");

  [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ];
  const [tags, setTags] = useState<tagInterface[]>([
    { tweetId: "", value: "important", label: "Important" },
    { tweetId: "", value: "funny", label: "Funny" },
    { tweetId: "", value: "relatable", label: "Relatable" },
  ]);

  const handleTagModal = (id: string) => {
    setTagModal(id);
  };

  const createTag = (query: string, id: string) => {
    const item = {
      tweetId: id,
      value: query,
      label: query,
    };
    setTags((current) => [...current, item]);

    console.log("tags", tags);
    return item;
  };

  const { data: session } = useSession();

  function useData() {
    const { isLoading, error, data } = useBookmarks();
    return { data, error, isLoading };
  }

  const allBoomarks = useData();

  const loadingState = allBoomarks.isLoading;
  const userData = allBoomarks.data;
  const errorState = allBoomarks.error;

  const [userBookmarks, setUserBookmarks] = useState<BookMarkInterface[]>([]);

  useEffect(() => {
    userData !== undefined &&
      userData.data !== undefined &&
      setUserBookmarks(userData.data.data);
  }, [userData]);

  const [search, setSearch] = useState<string>("");
  const [openSearch, setOpenSearch] = useState(false);

  if (loadingState) {
    return (
      <div className={classes.skeleton}>
        <>
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
      </div>
    );
  }

  if (session) {
    return (
      <div className={classes.wrapper}>
        <header>
          <div className={classes.avi}>
            <Button
              mt={20}
              leftIcon={<IconBrandTwitter />}
              component="a"
              target="_blank"
              variant="default"
              color="gray"
            >
              View tagged bookmark-tweets
            </Button>
            <Image
              src={session?.user?.image!}
              alt="profile_pic"
              width={30}
              height={30}
            />
            {/* <span>{session?.user?.name}</span> */}
          </div>

          <h1>Bkmrked</h1>

          <div>
            <ActionIcon
              onClick={() => setOpenSearch(!openSearch)}
              variant={openSearch ? "filled" : "light"}
            >
              <IconSearch size={20} />
            </ActionIcon>

            <ActionIcon onClick={() => signOut()} variant="light">
              <IconSun size={20} />
            </ActionIcon>
          </div>
        </header>

        {openSearch && (
          <section className={classes.search_section}>
            <div>
              <Input
                icon={<IconSearch />}
                variant="filled"
                placeholder="Search through bookmarks with tweet/username/name"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </section>
        )}

        <main>
          {userBookmarks
            .filter((data) => {
              if (search === "") {
                return userBookmarks;
              } else if (
                data.text.toLowerCase().includes(search.toLowerCase()) ||
                data.username.toLowerCase().includes(search.toLowerCase()) ||
                data.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return userBookmarks;
              }
            })
            ?.map((data) => {
              const tweetLink = data.text.slice(-24);
              const tweet = data.text;
              return (
                <div key={data.id}>
                  {/* <h1>{data.text}</h1> */}

                  <Card
                    className={classes.cards}
                    shadow="sm"
                    p="lg"
                    radius="md"
                    mt={40}
                    withBorder
                  >
                    <Card.Section></Card.Section>

                    <Group position="center" mt="sm" mb="xs">
                      <Text weight={500}>@{data.username}</Text>
                      <Badge color="pink" variant="light">
                        Tag
                      </Badge>
                    </Group>

                    <Text size="sm" color="dimmed">
                      {tweet}
                    </Text>

                    {/* <TwitterTweetEmbed
                      options={{ height: 200, theme: "dark" }}
                      tweetId={data.id}
                    /> */}

                    <Group position="center">
                      <Button
                        leftIcon={<IconBrandTwitter />}
                        component="a"
                        href={tweetLink}
                        target="_blank"
                        variant="light"
                        color="blue"
                        mt="md"
                        radius="md"
                      >
                        Go to Tweet
                      </Button>

                      <Button
                        variant="light"
                        onClick={() => handleTagModal(data.id)}
                        color="blue"
                        mt="sm"
                        radius="md"
                      >
                        Add tag
                      </Button>

                      <Modal
                        opened={tagModal === data.id ? true : false}
                        onClose={() => setTagModal("")}
                        title="Type in a tag "
                      >
                        <MultiSelect
                          label="Tags"
                          data={tags}
                          placeholder="Select items"
                          searchable
                          creatable
                          getCreateLabel={(query) => `+ Create ${query}`}
                          onCreate={(query) => createTag(query, data.id)}
                        />

                        <Text>
                          {tags[0].tweetId} --- {tags[0].value}{" "}
                        </Text>
                      </Modal>
                    </Group>
                  </Card>

                  {/* <TwitterTweetEmbed tweetId={data.id} /> */}
                  {/* <TweetEmbed tweetId={data.id} /> */}
                </div>
              );
            })}
        </main>
      </div>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default User;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["Bookmarks"], () => userBkmrks());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
