import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BookmarkCards from "../../components/bookmarks/cards";
import EmptyBookmarks from "../../components/bookmarks/empty";
import BookmarksPageHeader from "../../components/bookmarks/header";
import CreateTagModal from "../../components/create_tag_modal";
import SearchAndCreate from "../../components/search_and_create";
import { bookmarkPageStyle } from "../../components/styles/style";
import { useActiveBookmarks } from "../../utils/context";

interface tagInterface {
  label: string;
  value: string;
}

const Bookmarks = () => {
  const { classes } = bookmarkPageStyle();
  // const [tagModal, setTagModal] = useState<string>("");

  const tagInitialValues = [
    { value: "important", label: "Important" },
    { value: "funny", label: "Funny" },
  ];

  const [tags, setTags] = useState<tagInterface[]>(tagInitialValues);

  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  const [search, setSearch] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);

  const { activeBookmarks } = useActiveBookmarks();
  const userId: string = session?.user?.id;

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
            tags={tags}
            setTags={setTags}
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
