import { createStyles } from "@mantine/core";

export const searchCreateComponentStyle = createStyles(
  (theme, _params, getRef) => ({
    mid_section: {
      ref: getRef("mid_section"),
      background: "transparent",
      width: "100vw",
      // backdropFilter: "blur(10px)",
      display: "grid",
      placeItems: "center",
      alignItems: "center",

      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        width: "90vw",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        placeItems: "center",

        [`& .${getRef("search")}`]: {
          input: {
            width: "20vw",
            marginBottom: ".6rem",
          },
        },
      },
    },

    search: {
      ref: getRef("search"),
      display: "grid",
      placeItems: "center",

      input: {
        width: "90vw",
      },
    },

    tagSelect: {
      marginTop: ".5rem",

      label: {
        fontWeight: 700,
        paddingBlock: ".3rem",
      },
    },
  })
);
