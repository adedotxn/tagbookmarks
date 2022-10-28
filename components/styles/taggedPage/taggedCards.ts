import { createStyles } from "@mantine/core";

export const taggedCardsComponentStyle = createStyles(
  (theme, _params, getRef) => ({
    cards: {
      ref: getRef("cards"),
      width: "90vw",
      marginTop: "0rem",

      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        width: "40vw",
      },
    },

    card_section: {
      padding: "1rem",
      div: {
        h3: {
          fontSize: "1.1rem",
        },
      },
    },

    username: {
      textDecoration: "underline",
      fontSize: ".85rem",
      marginLeft: ".5rem",
    },

    card_btns: {
      marginTop: "1rem",
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
  })
);
