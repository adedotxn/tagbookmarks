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
