import { Alert, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useRouter } from "next/router";
import { emptyComponentStyle } from "../styles/empty";

const ErrorComponent = ({ error }: any) => {
  const { classes } = emptyComponentStyle();
  const router = useRouter();

  const message = error;
  return (
    <>
      {/* <Box className={classes.empty}>
        <div>
          <Text align="center" size={20} weight={700}>
            {message}
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
      </Box> */}
      <div className={classes.empty}>
        <Alert icon={<IconAlertCircle size={16} />} title="Bummer!" color="red">
          {message}
        </Alert>
        <Button
          mt={30}
          component="a"
          target="_blank"
          variant="default"
          color="gray"
          compact
          onClick={() => router.push("/")}
        >
          Go back to homepage
        </Button>
      </div>
    </>
  );
};

export default ErrorComponent;
