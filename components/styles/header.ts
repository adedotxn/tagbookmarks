import { createStyles } from "@mantine/core";

export const headerStyle = createStyles((theme, _params, getRef) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    margin: 0,
    width: "95vw",

    h1: {
      padding: 0,
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
}));
