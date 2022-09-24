import { useSession } from "next-auth/react";
import { useState } from "react";
import BookmarkCards from "../components/bookmarks/cards";
import EmptyBookmarks from "../components/bookmarks/empty";
import BookmarksPageHeader from "../components/bookmarks/header";
import CreateTagModal from "../components/create_tag_modal";
import SearchAndCreate from "../components/search_and_create";
import { bookmarkPageStyle } from "../components/styles/style";
import { mockdata } from "../mockdata";
import { useActiveBookmarks } from "../utils/context";

export interface tagInterface {
  label: string;
  value: string;
}

const Bookmarks = () => {
  const { classes } = bookmarkPageStyle();

  // const [tagModal, setTagModal] = useState<string>("");

  const tagInitialValues = [
    { value: "important", label: "Important" },
    { value: "funny", label: "Funny" },
    { value: "relatable", label: "Relatable" },
  ];
  const [tags, setTags] = useState<tagInterface[]>(tagInitialValues);

  // const handleTagModal = (id: string) => {
  //   setTagModal(id);
  // };

  const { data: session } = useSession();

  const [search, setSearch] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);

  const { activeBookmarks } = useActiveBookmarks();

  return (
    <div className={classes.wrapper}>
      <>
        <BookmarksPageHeader />
      </>

      <section>
        <SearchAndCreate
          length={mockdata.length}
          info={`Tagged: ${mockdata.length} tweets`}
          search={search}
          setSearch={setSearch}
          setOpenModal={setOpenModal}
        />

        <CreateTagModal
          openModal={openModal}
          tags={tags}
          setTags={setTags}
          setOpenModal={setOpenModal}
        />
      </section>

      <main>
        {mockdata.length === 0 ? (
          <EmptyBookmarks />
        ) : (
          <BookmarkCards data={mockdata} tags={tags} search={search} />
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
