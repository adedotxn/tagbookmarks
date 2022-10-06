import { Button, Group, Input, Loader, Title, Tooltip } from "@mantine/core";
import { IconAlertCircle, IconNumber } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import apiClient from "../../utils/api/http-config";
import { useActiveBookmarks } from "../../utils/context";
import { indexPageStyle } from "../styles/index_style";
import SearchButton from "./searchButton";

const InputContainer = () => {
  const { classes } = indexPageStyle();
  const { data: session } = useSession();
  const [noOfBookmarks, setNumberOfBookmarks] = useState<number>(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const { activeBookmarks, setActiveBookmarks } = useActiveBookmarks();

  const validate = (number: number) => {
    if (number === 0 || (number > 1 && number <= 50)) {
      setErrorMessage("");
    } else if (number < 1) {
      setErrorMessage("Number of tweets should be > 1");
    } else if (number > 50) {
      setErrorMessage("Number of tweets should be < 50");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberOfBookmarks(parseInt(e.target.value));
    validate(noOfBookmarks);
  };

  const {
    isLoading,
    isError,
    data: returnedBookmarks,
    error,
    isFetching,
    fetchStatus,
  } = useQuery(
    ["Bookmarks", noOfBookmarks],
    async () => {
      const fetch = await apiClient.get(`/bookmarks/${noOfBookmarks}`);
      console.log("fetch.data -- ", fetch.data);
      return fetch.data;
    },
    {
      retry: 5,
      enabled: startSearch,
    }
  );

  !isLoading &&
    !isFetching &&
    !isError &&
    console.log("returneddd in effect", activeBookmarks);

  useEffect(() => {
    !isLoading &&
      !isFetching &&
      returnedBookmarks !== undefined &&
      setActiveBookmarks(returnedBookmarks.data);
  }, [
    isFetching,
    isLoading,
    returnedBookmarks,
    activeBookmarks,
    setActiveBookmarks,
  ]);

  useEffect(() => {
    if (isError) {
      setStartSearch(false);
    }
  }, [isError]);

  const initiateSearch = () => {
    if (noOfBookmarks === (undefined || NaN)) {
      return alert("number is undefined or is not a valid number, ");
    }
    setStartSearch(true);
  };

  if (isError) {
    return (
      <section className={classes.errorComponent}>
        <div>
          <p>
            Sorry 😬, Failed getting your bookmarks. Twitter requires your
            reauthorization
          </p>
          <p>
            or i just have not figured out how to persist your authorization
            state (yet) 😔, either way
          </p>
        </div>

        <Button
          variant="default"
          color="gray"
          compact
          onClick={() => signIn("twitter")}
        >
          Authorize twitter-bkmrkd again :)
        </Button>
      </section>
    );
  }

  return (
    <>
      <>
        <div className={classes.input_container}>
          <Input.Wrapper
            className="input-demo"
            withAsterisk
            label="Twitter Bookmarks to Fetch"
            description="Please enter a number between 1 and 50. Fetched bookmarks may exceed this number though"
            error={errorMessage}
          >
            <Input
              type="number"
              min="2"
              max="50"
              icon={<IconNumber />}
              value={noOfBookmarks}
              onChange={handleChange}
              placeholder="e.g 10"
              rightSection={
                <Tooltip
                  label="No of bookmarks to get"
                  position="top-end"
                  withArrow
                  mb={20}
                >
                  <div>
                    <IconAlertCircle
                      size={18}
                      style={{ display: "block", opacity: 0.5 }}
                    />
                  </div>
                </Tooltip>
              }
            />
          </Input.Wrapper>

          <SearchButton
            initiateSearch={initiateSearch}
            noOfBookmarks={noOfBookmarks}
            startSearch={startSearch}
            fetchStatus={fetchStatus}
          />
        </div>

        <div className={classes.defaults}>
          <Group spacing="sm" className={classes.default_btns}>
            {returnedBookmarks ? (
              <>
                <Link href={`bookmarks/${session?.user?.name}`}>
                  <Button>Go see bookmarks </Button>
                </Link>
              </>
            ) : (
              <>
                {startSearch && fetchStatus === "fetching" ? (
                  <Button style={{ display: "grid", placeItems: "center" }}>
                    <Loader color="white" size={20} mr={20} />
                  </Button>
                ) : (
                  <Button disabled>
                    Waiting for your commmand milord/lady
                  </Button>
                )}
              </>
            )}

            {isError && <>{error}</>}
          </Group>
        </div>

        <div className={classes.view_tagged}>
          <Title order={4}>Already have some bookmarks tagged?</Title>
          <Button
            variant="default"
            component="a"
            color="gray"
            href="/tagged"
            compact
          >
            Go view tagged bookmark-tweets
          </Button>
        </div>
      </>
    </>
  );
};

export default InputContainer;
