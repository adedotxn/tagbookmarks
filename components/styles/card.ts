import { createStyles } from "@mantine/core";

export const cardStyle = createStyles((theme, _params, getRef) => ({
  cards: {
    ref: getRef("cards"),
    width: "80vw",
    marginTop: "0rem",
  },

  card_section: {
    padding: "1rem",
  },

  username: {
    textDecoration: "underline",
  },

  card_btns: {
    marginTop: "1rem",
  },

  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    [`& .${getRef("cards")}`]: {
      width: "40vw",
    },
  },
}));
