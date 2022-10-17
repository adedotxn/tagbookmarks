import { createStyles } from "@mantine/core";

export const cardStyle = createStyles((theme, _params) => ({
  cards: {
    width: "80vw",
    marginTop: "0rem",

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: "40vw",
    },
  },

  card_section: {
    padding: "1rem",
    display: "grid",

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
}));
