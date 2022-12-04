import { useQueries } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import BookmarkCards from "../components/bookmarks/allCards";
import EmptyBookmarks from "../components/bookmarks/empty";
import BookmarksPageHeader from "../components/bookmarks/header";
import CreateTagModal from "../components/modal/create_tag_modal";
import SearchAndCreate from "../components/search_and_create";
import apiClient from "../utils/api/http-config";
import { useAllBookmarksContextHook } from "../utils/context";
import { bookmarkPageStyle } from "./bookmarks/[index]";

const AllBookmarks = () => {
  const { data: session } = useSession();
  const USER_ID = session?.user.id;
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const { classes } = bookmarkPageStyle();
  const { allBookmarks } = useAllBookmarksContextHook();

  const userQueries = useQueries({
    queries: allBookmarks.map((user) => {
      return {
        queryKey: ["user", user.author_id],
        queryFn: async () => {
          const fetch = await apiClient.get(
            `/all/details/${user.author_id}/${USER_ID}`
          );
          return fetch.data;
        },
      };
    }),
  });
  //Dynamic parallel queries

  let userLoading = userQueries[0]?.isLoading;
  const returned = userQueries[0]?.data;

  if (!userLoading) {
    console.log("returned", returned);
  }

  return (
    <div className={classes.wrapper}>
      {/* <h1>{JSON.stringify(data?.data?.bookmarks_realData.data.length)}</h1>
      <h1>{JSON.stringify(data?.data?.nextToken, null, 3)}</h1> */}
      {/* <p>
        Bookmarks:{" "}
        {JSON.stringify(data?.data?.bookmarks._realData.data, null, 3)}
      </p> */}
      {/* <p>Bookmarks: {JSON.stringify(data?.data?.bookmarks, null, 3)}</p> */}
      <>
        <BookmarksPageHeader />
      </>

      <section>
        <SearchAndCreate
          length={allBookmarks.length}
          info={`Fetched: ${allBookmarks.length} tweets`}
          search={search}
          setSearch={setSearch}
          setOpenModal={setOpenModal}
          placeholder="Search through bookmarks with username/tweet"
        />

        <CreateTagModal
          openModal={openModal}
          // tags={tags}
          // setTags={setTags}
          setOpenModal={setOpenModal}
        />
      </section>

      <main>
        {allBookmarks.length === 0 ? (
          <EmptyBookmarks />
        ) : (
          <BookmarkCards data={allBookmarks} search={search} />
        )}
      </main>
    </div>
  );
};
export default AllBookmarks;
