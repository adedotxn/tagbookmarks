import { createStyles } from "@mantine/core";

export const taggedPageStyle = createStyles((theme, _params, getRef) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",
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
