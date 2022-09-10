import { Button, createStyles } from "@mantine/core";
import { IconBrandTwitter } from "@tabler/icons";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",

    section: {
      display: "grid",
      placeItems: "center",
    },

    h1: {
      textTransform: "uppercase",
      fontSize: "1.7rem",
      background: theme.fn.gradient({
        from: "blue",
        to: "teal",
        deg: 20,
      }),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      // // Type safe child reference in nested selectors via ref
      // [`& .${getRef("child")}`]: {
      //   fontSize: theme.fontSizes.xs,
      // },

      h1: {
        fontSize: "4rem",
        letterSpacing: ".5rem",
      },
    },
  },

  login_btn: {
    textTransform: "uppercase",
    ...theme.fn.focusStyles(),

    "&:hover": {
      backgroundColor: theme.fn.darken("#00acee", 0.05),
    },
  },
}));

const Home: NextPage = () => {
  const { classes } = useStyles();

  const { data: session } = useSession();
  // console.log("Session", session)

  return (
    <div className={classes.wrapper}>
      <section>
        <h1>Welcome to Bkmrkd.</h1>

        <div>
          <Link href="/hello">
            <Button
              onClick={() => signIn("twitter", { callbackUrl: "/user" })}
              className={classes.login_btn}
              leftIcon={<IconBrandTwitter />}
              component="a"
              target="_blank"
            >
              Login with Twitter
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
