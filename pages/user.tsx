import {
  ActionIcon,
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTwitter, IconSun } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBookmarks } from "../utils/api/api-hooks";
import { BookMarkInterface } from "../utils/interface";

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",

    section: {
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
}));

const User = () => {
  const { classes } = useStyles();
  const matches = useMediaQuery("(max-width: 700px)", true, {
    getInitialValueInEffect: false,
  });

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
      setUserBookmarks(userData.data);
  }, [userData]);

  if (loadingState) {
    return (
      <div>
        <h1>loaidngggg</h1>
      </div>
    );
  }

  if (session) {
    console.log("all bookmarks", userBookmarks);

    const data = userBookmarks.map((data) => {
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
                {tweetLink}
              </Button>

              <Button variant="light" color="blue" mt="sm" radius="md">
                Add tag
              </Button>
            </Group>
          </Card>
        </div>
      );
    });
    return (
      <div className={classes.wrapper}>
        <section>
          <div className={classes.avi}>
            <Image
              src={session?.user?.image!}
              alt="profile_pic"
              width={30}
              height={30}
            />
            {/* <span>{session?.user?.name}</span> */}
          </div>

          <h1>Bkmrked</h1>

          <div onClick={() => signOut()}>
            <ActionIcon variant="light">
              <IconSun size={16} />
            </ActionIcon>
          </div>
        </section>

        {/* <div>
          <button onClick={() => signOut()}>Sign out</button>
        </div> */}

        {/* <main>{JSON.stringify(data)}</main> */}

        <main>
          {/* {userData?.data?.map((data) => {
            <div>{data.id}</div>;
          })} */}
          {data}
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
