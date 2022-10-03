import { Avatar, Button, Group, Indicator, Title } from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import InputContainer from "../components/index/input_container";
import { indexPageStyle } from "../components/styles/index_style";

const Home = () => {
  const { classes } = indexPageStyle();
  const { data: session } = useSession();
  const [noOfBookmarks, setNumberOfBookmarks] = useState<number>(2);

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Title order={2}>BKMRKD</Title>
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

export default Home;
