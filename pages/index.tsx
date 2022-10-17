import { Avatar, Button, Group, Indicator, Title } from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import InputContainer from "../components/index/input_container";
import { indexPageStyle } from "../components/styles/index_style";

const Home = () => {
  /**  Fetching / Getting */
  const { classes } = indexPageStyle();
  const { data: session } = useSession();

  /** Effects */
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  /** Component Conditional Rendering */
  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Title order={2}>tagBookmarks</Title>
        {session && (
          <Button onClick={() => signOut()} variant="default" color="gray">
            Log Out
          </Button>
        )}
      </header>

      {session && (
        <div>
          <div className={classes.header_details}>
            <Title order={3}>{session?.user?.name}</Title>
            <Group position="center">
              <Indicator color="lime">
                <Avatar size="sm" src={session?.user?.image!} />
              </Indicator>
            </Group>
          </div>
        </div>
      )}

      <div className={classes.wrapper}>
        {session ? (
          <>
            <InputContainer />
          </>
        ) : (
          <>
            <section className={classes.outOfSession}>
              <Title className={classes.title_1} order={2}>
                <span>tagBookmarks</span> can be used to search through your
                twitter bookmarks.
              </Title>
              <Title className={classes.title_2} order={2}>
                Pin <span>tags / labels</span> to your bookmarked tweets.
              </Title>

              <div>
                <Button
                  mt={25}
                  onClick={() => signIn("twitter")}
                  leftIcon={<IconBrandTwitter />}
                  component="a"
                  variant="default"
                  color="gray"
                >
                  Sign In with Twitter
                </Button>
              </div>

              <footer>
                © adedotxn 2022. <br /> nifty tool built by{" "}
                <a
                  target="_blank"
                  href="https://twitter.com/adedotxn"
                  rel="noreferrer"
                >
                  @adedotxn
                </a>
              </footer>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
