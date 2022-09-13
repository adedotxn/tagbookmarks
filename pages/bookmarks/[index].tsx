import {
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Input,
  Modal,
  MultiSelect,
  Text,
} from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconBrandTwitter, IconPlus, IconSearch } from "@tabler/icons";
import { signIn, useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { useActiveBookmarks } from "../../utils/context";

interface tagInterface {
  label: string;
  value: string;
}
const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",
    // border: "1px solid green",

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      [`& .${getRef("child")}`]: {
        fontSize: theme.fontSizes.xs,
      },

      [`& .${getRef("cards")}`]: {
        width: "40vw",
      },

      [`& .${getRef("mid_section")}`]: {
        display: "flex",
      },

      [`& .${getRef("search")}`]: {
        input: {
          width: "40vw",
          marginBottom: ".6rem",
        },
      },
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    margin: 0,
    // border: "1px solid red",
    width: "95vw",

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

  avi: {},

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
    marginTop: "0rem",
  },

  skeleton: {
    display: "grid",
    placeItems: "center",
  },

  mid_section: {
    ref: getRef("mid_section"),
    background: "transparent",
    width: "90vw",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },

  search: {
    ref: getRef("search"),
    display: "grid",
    placeItems: "center",

    input: {
      width: "80vw",
    },
  },

  modal: {
    button: {
      marginTop: ".6rem",
    },
  },
}));

const Bookmarks = () => {
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 768px)", true, {
    getInitialValueInEffect: false,
  });

  const [tagModal, setTagModal] = useState<string>("");

  [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
  ];
  const [tags, setTags] = useState<tagInterface[]>([
    { value: "important", label: "Important" },
    { value: "funny", label: "Funny" },
    { value: "relatable", label: "Relatable" },
  ]);

  const handleTagModal = (id: string) => {
    setTagModal(id);
  };

  const { data: session } = useSession();

  const [search, setSearch] = useState<string>("");
  const [openSearch, setOpenSearch] = useState(false);
  const [debounced] = useDebouncedValue(search, 200);

  const [openModal, setOpenModal] = useState(false);

  const { activeBookmarks } = useActiveBookmarks();

  if (session) {
    return (
      <div className={classes.wrapper}>
        <header className={classes.header}>
          <div className={classes.avi}>
            {matches && (
              <Button
                // mt={20}
                component="a"
                target="_blank"
                variant="default"
                color="gray"
                compact
              >
                View tagged bookmark-tweets
              </Button>
            )}
            {/* <Image
              src={session?.user?.image!}
              alt="profile_pic"
              width={30}
              height={30}
            /> */}
          </div>

          <h1>Bkmrked</h1>

          {matches && (
            <div>
              <Button
                // mt={20}
                component="a"
                target="_blank"
                variant="default"
                color="gray"
                compact
              >
                Back to homepage
              </Button>
            </div>
          )}
        </header>

        <section className={classes.mid_section}>
          <div className={classes.search}>
            <Text>Tweets found: {activeBookmarks.length} </Text>
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

          <div>
            <Button
              onClick={() => setOpenModal(true)}
              variant="default"
              leftIcon={<IconPlus />}
            >
              Create Tag
            </Button>
          </div>
        </section>

        <Modal
          opened={openModal}
          onClose={() => setOpenModal(false)}
          title="Create Tags to put on your bookmarks"
          className={classes.modal}
        >
          <MultiSelect
            label="Type in a new tag to add to your list of tags"
            data={tags}
            placeholder="e.g 'Tech Tweets'"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setTags((current) => [...current, item]);
              return item;
            }}
          />

          <Button onClick={() => setOpenModal(false)} variant="default">
            Create New Tag
          </Button>
        </Modal>

        <main>
          {/* <Text>Tweets found: {activeBookmarks.length} </Text> */}
          {activeBookmarks
            .filter((data) => {
              if (debounced === "") {
                return activeBookmarks;
              } else if (
                data.text.toLowerCase().includes(debounced.toLowerCase()) ||
                data.username.toLowerCase().includes(debounced.toLowerCase()) ||
                data.name.toLowerCase().includes(debounced.toLowerCase())
              ) {
                return activeBookmarks;
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

export default Bookmarks;
