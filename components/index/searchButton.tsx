import { Button, Loader } from "@mantine/core";

function SearchButton({
  initiateSearch,
  startSearch,
  noOfBookmarks,
  fetchStatus,
}: {
  initiateSearch: () => void;
  noOfBookmarks: number;
  startSearch: boolean;
  fetchStatus: "fetching" | "idle" | "paused";
}): JSX.Element {
  return (
    <Button onClick={initiateSearch}>
      {fetchStatus === "fetching" && startSearch ? (
        <Loader color="white" size={20} mr={20} />
      ) : (
        ""
      )}
      Get {noOfBookmarks} Bookmarks
    </Button>
  );
}

export default SearchButton;
