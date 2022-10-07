import { createStyles } from "@mantine/core";

export const bookmarkPageStyle = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      [`& .${getRef("child")}`]: {
        fontSize: theme.fontSizes.xs,
      },

      [`& .${getRef("cards")}`]: {
        width: "40vw",
      },

      [`& .${getRef("mid_section")}`]: {
        width: "90vw",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        placeItems: "center",
      },

      [`& .${getRef("search")}`]: {
        input: {
          width: "20vw",
          marginBottom: ".6rem",
        },
      },

      // [`& .${getRef("tagged_prompt")}`]: {
      //   [`& div:first-child`]: {
      //     width: "40vw",
      //     border: "2px solid red",
      //   },
      // },
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
  card_btns: {
    marginTop: "1rem",
  },
  card_section: {
    padding: "1rem",
  },
  username: {
    // borderBottom: "2px solid grey",
    textDecoration: "underline",
  },

  skeleton: {
    display: "grid",
    placeItems: "center",
  },

  mid_section: {
    ref: getRef("mid_section"),
    background: "transparent",
    width: "100vw",
    // backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    alignItems: "center",
  },

  search: {
    ref: getRef("search"),
    display: "grid",
    placeItems: "center",

    input: {
      width: "90vw",
    },
  },

  modal: {
    // border: "2px solid green",

    button: {
      marginTop: ".6rem",
    },
  },

  empty: {
    // backgroundColor: "gray",
    width: "90vw",
    borderRadius: ".5rem",
    display: "grid",
    placeItems: "center",
    height: "70vh",
  },

  badge: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    // placeItems: "center",
    alignItems: "center",

    div: {
      width: "fit-content",
    },
  },

  tagSelect: {
    marginTop: ".5rem",

    // div: {
    //   display: "grid",
    //   placeItems: "center",
    // },

    label: {
      fontWeight: 700,
      paddingBlock: ".3rem",
    },
  },

  tagged_prompt: {
    ref: getRef("tagged_prompt"),
    display: "grid",
    placeItems: "center",
    // height: "70vw",
    marginTop: "40vh",

    [`& > div:first-child`]: {
      width: "80vw",
    },
  },
}));
