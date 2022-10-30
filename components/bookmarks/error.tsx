import { Alert, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { errorComponentStyle } from "../styles/empty";

const ErrorComponent = ({ errorMsg, error }: any) => {
  const { classes } = errorComponentStyle();
  const router = useRouter();

  const message = error;
  return (
    <>
      <div className={classes.error}>
        <Alert icon={<IconAlertCircle size={16} />} title={message} color="red">
          {errorMsg.includes("40") ? (
            <Button
              mt={10}
              variant="default"
              color="gray"
              compact
              onClick={() => signIn("twitter")}
            >
              Reauthorize tagbookmarks
            </Button>
          ) : (
            <Button
              component="a"
              target="_blank"
              variant="default"
              color="gray"
              compact
              onClick={() => router.push("/")}
            >
              Go back to homepage
            </Button>
          )}
        </Alert>
      </div>
    </>
  );
};

export default ErrorComponent;
