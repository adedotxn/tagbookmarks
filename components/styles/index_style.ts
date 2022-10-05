import { createStyles } from "@mantine/core";

export const indexPageStyle = createStyles((theme, _params, getRef) => ({
  container: {
    display: "grid",
    placeItems: "center",

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      [`& .${getRef("child")}`]: {
        fontSize: theme.fontSizes.xs,
      },

      [`& .${getRef("title_1")}`]: {
        fontSize: "3rem",
      },
      [`& .${getRef("title_2")}`]: {
        fontSize: "2.5rem",
        marginTop: "1.3rem",
      },
    },
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
    marginTop: "1rem",

    div: {
      marginLeft: ".2rem",
    },

    h3: {},

    img: {
      borderRadius: "50%",
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
    width: "90vw",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
  },

  title_1: {
    ref: getRef("title_1"),

    fontSize: "2rem",
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
    ref: getRef("title_2"),
    marginTop: "1rem",
    fontSize: "1.7rem",

    fontWeight: 500,
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
  errorComponent: {
    display: "grid",
    placeItems: "center",
    border: "1px solid grey",
    borderRadius: ".5rem",
    width: "80vw",

    div: {
      p: {
        textAlign: "center",
        fontWeight: 500,
      },
    },

    button: {
      margin: "1rem 0rem",
    },
  },
}));
