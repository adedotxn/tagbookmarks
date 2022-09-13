import {
  Avatar,
  Button,
  createStyles,
  Group,
  Indicator,
  Input,
  Loader,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle, IconBrandTwitter, IconNumber } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import apiClient from "../utils/api/http-config";
import { useActiveBookmarks } from "../utils/context";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    display: "grid",
    placeItems: "center",
  },
  wrapper: {
    display: "grid",
    placeItems: "center",
    marginTop: "15vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    width: "100vw",
    padding: ".5rem 2rem",

    h2: {
      background: theme.fn.gradient({
        from: "cyan",
        to: "indigo",
        deg: 25,
      }),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },

  header_details: {
    display: "flex",
    alignItems: "center",

    h3: {},

    img: {
      borderRadius: "50%",
      marginLeft: ".5rem",
    },
  },

  details: {
    display: "grid",
    alignItems: "center",
    // border: "1px solid red",
    placeItems: "center",
    marginTop: "10vh",

    div: {
      borderRadius: "50%",

      img: {
        borderRadius: "50%",
      },
    },

    h2: {
      // marginLeft: "1rem",
      textDecoration: "underline",
    },
  },

  input_container: {
    display: "grid",
    placeItems: "center",
    width: "80vw",

    button: {
      width: "fit-content",
      marginTop: "1rem",
      fontWeight: 500,
    },
  },

  view_tagged: {
    marginTop: "3rem",

    display: "grid",
    placeItems: "center",
    border: "1px solid gray",
    padding: "1rem",
    borderRadius: ".5rem",

    button: {
      marginTop: ".9rem",
    },
  },

  defaults: {
    marginTop: "2rem",
    display: "grid",
    placeItems: "center",
  },
  default_btns: {
    display: "grid",
  },

  outOfSession: {
    width: "80vw",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
  },

  title_1: {
    span: {
      background: theme.fn.gradient({
        from: "cyan",
        to: "indigo",
        deg: 25,
      }),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textTransform: "uppercase",
    },
  },

  title_2: {
    span: {
      background: theme.fn.gradient({
        from: "cyan",
        to: "indigo",
        deg: 25,
      }),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
}));
const Load = () => {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const [noOfBookmarks, setNumberOfBookmarks] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (number: number) => {
    if (number === 0 || (number > 1 && number <= 50)) {
      setErrorMessage("");
    } else if (number < 1) {
      setErrorMessage("Number of tweets should be > 1");
    } else if (number > 50) {
      setErrorMessage("Number of tweets should be < 50");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberOfBookmarks(parseInt(e.target.value));
  };

  useEffect(() => {
    validate(noOfBookmarks);
  }, [noOfBookmarks]);

  // const [bookmarks, setBookmarks] = useState([]);
  const [startSearch, setStartSearch] = useState(false);

  const {
    isLoading,
    isError,
    data: returnedBookmarks,
    error,
    isFetching,
    status,
    fetchStatus,
  } = useQuery(
    ["Bookmarks", noOfBookmarks],
    async () => {
      const fetch = await apiClient.get(`/bookmarks/${noOfBookmarks}`);
      console.log("fetch.data -- ", fetch.data);
      return fetch.data;
    },
    {
      enabled: !!startSearch,
    }
  );

  const { activeBookmarks, setActiveBookmarks } = useActiveBookmarks();

  useEffect(() => {
    !isLoading &&
      !isFetching &&
      console.log("returneddd in effect", returnedBookmarks);

    !isLoading &&
      !isFetching &&
      returnedBookmarks !== undefined &&
      setActiveBookmarks(returnedBookmarks.data);

    !isLoading && !isFetching && returnedBookmarks
      ? console.log("yasss")
      : console.log("naurrrr");
  }, [isFetching, isLoading, returnedBookmarks, activeBookmarks]);

  const initiateSearch = () => {
    if (noOfBookmarks === undefined) {
      return alert("no Of bookmarks is undefined, ");
    }
    setStartSearch(true);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Title order={2}>Bkmrked</Title>
        {session && (
          <>
            <div className={classes.header_details}>
              <Title order={3}>{session.user?.name}</Title>
              <Group position="center">
                <Indicator color="lime">
                  <Avatar size="sm" src={session?.user?.image!} />
                </Indicator>
              </Group>
            </div>

            <Button onClick={() => signOut()} variant="default" color="gray">
              Log Out
            </Button>
          </>
        )}
      </header>

      {/* {session && (
        <section className={classes.details}>
          <div>
            <Group position="center">
              <Indicator color="lime">
                <Avatar size="lg" src={session?.user?.image!} />
              </Indicator>
            </Group>
          </div>
          <Title order={2}>{session.user?.name}</Title>
        </section>
      )} */}
      <div className={classes.wrapper}>
        {session ? (
          <>
            <div className={classes.input_container}>
              <Input.Wrapper
                className="input-demo"
                withAsterisk
                label="Twitter Bookmarks to Fetch"
                description="Please enter a number between 1 and 50. Fetched bookmarks may exceed this number though"
                error={errorMessage}
              >
                <Input
                  type="number"
                  min="2"
                  max="50"
                  icon={<IconNumber />}
                  value={noOfBookmarks}
                  onChange={handleChange}
                  placeholder="e.g 10"
                  rightSection={
                    <Tooltip
                      label="No of bookmarks to get"
                      position="top-end"
                      withArrow
                      mb={20}
                    >
                      <div>
                        <IconAlertCircle
                          size={18}
                          style={{ display: "block", opacity: 0.5 }}
                        />
                      </div>
                    </Tooltip>
                  }
                />
              </Input.Wrapper>

              <Button onClick={initiateSearch}>
                {fetchStatus === "fetching" && (
                  <Loader color="white" size={20} mr={20} />
                )}
                Get {noOfBookmarks} Bookmarks
              </Button>
            </div>

            <div className={classes.defaults}>
              <Group spacing="sm" className={classes.default_btns}>
                {returnedBookmarks ? (
                  <>
                    <Link href={`bookmarks/${session?.user?.name}`}>
                      <Button>Go see bookmarks </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {fetchStatus === "fetching" ? (
                      <Button style={{ display: "grid", placeItems: "center" }}>
                        <Loader color="white" size={20} mr={20} />
                      </Button>
                    ) : (
                      <Button disabled>Waiting for your commmand milord</Button>
                    )}
                  </>
                )}
              </Group>
            </div>

            <div className={classes.view_tagged}>
              <Title order={4}>Already have some bookmarks tagged?</Title>
              <Button variant="default" color="gray" compact>
                Go view tagged bookmark-tweets
              </Button>
            </div>
          </>
        ) : (
          <>
            <section className={classes.outOfSession}>
              <Title className={classes.title_2} order={2}>
                <span>Bkmrkd</span> can be used to search through your twitter
                bookmarks.
              </Title>
              <Title className={classes.title_2} order={2}>
                Add <span>tags</span> to specific/special bookmarked tweets.
              </Title>

              <div>
                <Button
                  mt={20}
                  onClick={() => signIn("twitter")}
                  leftIcon={<IconBrandTwitter />}
                  component="a"
                  target="_blank"
                  variant="default"
                  color="gray"
                >
                  Sign In with Twitter
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Load;
