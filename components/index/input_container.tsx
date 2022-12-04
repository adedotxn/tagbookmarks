import { Button, Group, Input, Loader, Title, Tooltip } from "@mantine/core";
import { IconAlertCircle, IconNumber, IconX } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useAllBookmarks,
  useBookmarks,
} from "../../utils/api/hooks/getBookmarks";
import {
  useActiveBookmarks,
  useAllBookmarksContextHook,
} from "../../utils/context";
import ErrorComponent from "../bookmarks/error";
import { indexPageStyle } from "../styles/index_style";
import SearchButton from "./searchButton";

const validate = (
  number: number,
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  if (number === 0 || (number > 1 && number <= 50)) {
    setState("");
  } else if (number < 1) {
    setState("Number of tweets should be > 1");
  } else if (number > 50) {
    setState("Number of tweets should be < 50");
  }
};

const InputContainer = () => {
  const { classes } = indexPageStyle();
  const { data: session } = useSession();
  const USER_ID = session?.user.id;
  const [noOfBookmarks, setNumberOfBookmarks] = useState<number>(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  /*const [getAll, setGetAll] = useState(false);*/
  const { activeBookmarks, setActiveBookmarks } = useActiveBookmarks();
  const [gettingAll, setGetAll] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberOfBookmarks(parseInt(e.target.value));
    validate(noOfBookmarks, setErrorMessage);
  };

  const {
    isLoading,
    isError,
    data: returnedBookmarks,
    error,
    isFetching,
    fetchStatus,
  } = useBookmarks(USER_ID, noOfBookmarks, startSearch);

  const {
    isLoading: allLoading,
    data: allBookmarksData,
    error: allError,
    isError: isAllError,
    isFetching: isAllFetching,
    fetchStatus: fetchAllStatus,
  } = useAllBookmarks(USER_ID, gettingAll);

  const { allBookmarks, setAllBookmarks } = useAllBookmarksContextHook();

  const initiateSearch = () => {
    if (noOfBookmarks === undefined || isNaN(noOfBookmarks)) {
      return alert("number is undefined or is not a valid number, ");
    }
    setStartSearch(true);
  };

  // !isLoading &&
  //   !isFetching &&
  //   !isError &&
  //   console.log("Boookmarks returned", activeBookmarks.length);

  // !allLoading &&
  //   !isAllFetching &&
  //   !isAllError &&
  //   console.log("allBoookmarks returned", allBookmarks.length);

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
    !allLoading &&
      !isAllFetching &&
      allBookmarksData !== undefined &&
      setAllBookmarks(allBookmarksData.data?.bookmarks);
  }, [allLoading, isAllFetching, allBookmarksData, setAllBookmarks]);

  // useEffect(() => {
  //   if (allBookmarks.length > 0 || isAllError) {
  //     setGetAll(false);
  //   }
  // }, [allBookmarks, isAllError]);

  useEffect(() => {
    if (isError || !isLoading) {
      setStartSearch(false);
    }
  }, [isError, isLoading]);

  const stopSearch = () => {
    setStartSearch(false);
  };

  const fetchingNumbered = startSearch && fetchStatus == "fetching";
  const fetchingAll = gettingAll && fetchAllStatus == "fetching";

  if (isError) {
    if (error instanceof Error) {
      return (
        <ErrorComponent
          errorMsg={error.message}
          error="Error getting bookmarks. Please reauthorize tagBookmarks for twitter and try fetching again"
        />
      );
    } else {
      return <ErrorComponent errorMsg="Unexpected" error="Unexpected Error" />;
    }
  }

  if (isAllError) {
    if (allError instanceof Error) {
      console.log(allError.message);
      return (
        <ErrorComponent
          errorMsg={allError.message}
          error="Error getting bookmarks. Please reauthorize tagBookmarks for twitter and try fetching again"
        />
      );
    } else {
      return <ErrorComponent errorMsg="Unexpected" error="Unexpected Error" />;
    }
  }

  if (returnedBookmarks?.data.length === 0) {
    return (
      <ErrorComponent
        errorMsg=""
        error="Something either went wrong or your twitter bookmarks are empty. 
              Make sure you have at least one tweet bookmarked"
      />
    );
  }

  return (
    <>
      <>
        <div className={classes.input_container}>
          <Input.Wrapper
            className="input-demo"
            withAsterisk
            label="Twitter Bookmarks to Fetch."
            description="Please enter a number between 1 and 50. Fetched bookmarks may exceed or subceed this number though and also,
             THIS MAY TAKE A WHILE."
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
                  label="Number of bookmarks to get"
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

          <div className={classes.buttons}>
            <SearchButton
              initiateSearch={initiateSearch}
              noOfBookmarks={noOfBookmarks}
              startSearch={startSearch}
              fetchStatus={fetchStatus}
            />

            <div>
              <Tooltip
                label="This may not return > 100 but a page refresh should do the trick"
                position="bottom"
                withArrow
              >
                <Button compact size="md" onClick={() => setGetAll(true)}>
                  Get {">"} 100 Bookmarks
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className={classes.defaults}>
          <Group spacing="sm" className={classes.default_btns}>
            {returnedBookmarks || allBookmarksData ? (
              <>
                {allBookmarks.length > 0 && (
                  <Link href={`all`}>
                    <Button>
                      all: View all ({`${allBookmarks.length}`}) bookmarks{" "}
                    </Button>
                  </Link>
                )}

                {activeBookmarks.length > 0 && (
                  <Link href={`bookmarks/${session?.user?.name}`}>
                    <Button>
                      specifics: View {`${activeBookmarks.length}`} of your
                      bookmarks
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                {fetchingNumbered || fetchingAll ? (
                  <div className={classes.btnLoading_container}>
                    <Button className={classes.btn_loading}>
                      <Loader variant="dots" color="white" size={30} />
                    </Button>
                    <div
                      onClick={stopSearch}
                      className={classes.stopBtn_loading}
                    >
                      <IconX color="red" />
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {isError && <>{error}</>}
          </Group>
        </div>

        <div className={classes.view_tagged}>
          <Title order={3}>Already have some bookmarks tagged?</Title>
          <Button
            variant="default"
            component="a"
            color="gray"
            href="/tagged"
            compact
            mt={5}
          >
            Go view tagged bookmark-tweets
          </Button>
        </div>
      </>
    </>
  );
};

export default InputContainer;
