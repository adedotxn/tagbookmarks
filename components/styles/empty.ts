import { createStyles } from "@mantine/core";

export const emptyComponentStyle = createStyles((_params) => ({
  empty: {
    width: "90vw",
    borderRadius: ".5rem",
    display: "grid",
    placeItems: "center",
    height: "70vh",
  },
}));

export const errorComponentStyle = createStyles((theme, _params) => ({
  error: {
    width: "90vw",

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: "40vw",
    },
  },
}));
