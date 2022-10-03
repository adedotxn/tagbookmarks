import { Box, Button, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { emptyComponentStyle } from "../styles/empty";

const EmptyBookmarks = () => {
  const { classes } = emptyComponentStyle();
  const router = useRouter();
  return (
    <>
      <Box className={classes.empty}>
        <div>
          <Text align="center" size={25} weight={700}>
            No bookmark has been tagged yet :)
          </Text>
          <Group mt={30} position="center">
            <Button
              // mt={20}
              component="a"
              target="_blank"
              variant="default"
              color="gray"
              compact
              onClick={() => router.push("/")}
            >
              Go back to homepage
            </Button>
          </Group>
        </div>
      </Box>
    </>
  );
};

export default EmptyBookmarks;
