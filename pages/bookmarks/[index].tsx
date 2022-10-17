import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BookmarkCards from "../../components/bookmarks/cards";
import EmptyBookmarks from "../../components/bookmarks/empty";
import BookmarksPageHeader from "../../components/bookmarks/header";
import CreateTagModal from "../../components/modal/create_tag_modal";
import SearchAndCreate from "../../components/search_and_create";
// import { bookmarkPageStyle } from "../../components/styles/bookmark";
import { createStyles } from "@mantine/core";
import { useActiveBookmarks } from "../../utils/context";

const bookmarkPageStyle = createStyles((_params) => ({
  wrapper: {
    display: "grid",
    placeItems: "center",
  },
}));

const Bookmarks = () => {
  /** States */
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const { activeBookmarks } = useActiveBookmarks();

  /**  Fetching / Getting */
  const { classes } = bookmarkPageStyle();
  const { data: session } = useSession();

  /** Effects */
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  /** Component Conditional Rendering */
  if (session) {
    return (
      <div className={classes.wrapper}>
        <>
          <BookmarksPageHeader />
        </>

        <section>
          <SearchAndCreate
            length={activeBookmarks.length}
            info={`Fetched: ${activeBookmarks.length} tweets`}
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
          {activeBookmarks.length === 0 ? (
            <EmptyBookmarks />
          ) : (
            <BookmarkCards data={activeBookmarks} search={search} />
          )}
        </main>
      </div>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Bookmarks;
