/* eslint-disable react/no-unescaped-entities */
import { Notification } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ErrorComponent from "../components/bookmarks/error";
import BookmarksPageHeader from "../components/bookmarks/header";
import CreateTagModal from "../components/modal/create_tag_modal";
import SearchAndCreate from "../components/search_and_create";
import { bookmarkPageStyle } from "../components/styles/style";
import TaggedCards from "../components/tagged/cards";
import { useTaggedGetter } from "../utils/api/hooks/getAllTagged";
import apiClient from "../utils/api/http-config";
import { authOptions } from "./api/auth/[...nextauth]";

export interface tagInterface {
  label: string;
  value: string;
}

export interface savedInterface {
  id: string;
  name: string;
  tags: string[];
  text: string;
  username: string;
}

const Bookmarks = () => {
  /** States */
  const [value, setValue] = useState<string | null>("");
  const [search, setSearch] = useState<string>("");
  const [debounced] = useDebouncedValue(search, 200);
  const [toSearch, setToSearch] = useState(debounced);
  const [openModal, setOpenModal] = useState(false);

  /**  Fetching / Getting */
  const { classes } = bookmarkPageStyle();
  const { data: session } = useSession();
  const userId = session !== undefined && session?.user.id;
  const {
    data: all,
    error,
    isLoading: taggedLoading,
    isError: isTagError,
    error: tagError,
  } = useTaggedGetter(userId);
  const userData = all?.data;

  /** Effects */
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  useEffect(() => {
    if (value === null || value === "" || value.length === 0) {
      return setToSearch(debounced);
    }
    if (value.length !== 0 && value !== null) {
      setToSearch(value);
    }
  }, [value, debounced]);

  /** Component Conditional Rendering */
  if (all?.data.length === 0) {
    return (
      <>
        <div>
          <ErrorComponent error="You have not tagged any bookmarks yet 😊" />
        </div>
      </>
    );
  }

  if (error) {
    if (error instanceof Error) {
      return (
        <div>
          <ErrorComponent error={error?.message} />
        </div>
      );
    } else {
      <div>
        <ErrorComponent error="Unexpected Error" />
      </div>;
    }
  }

  if (taggedLoading) {
    return (
      <div className={classes.tagged_prompt}>
        <Notification
          loading
          title="Getting your tagged bookmarks from server"
          disallowClose
        >
          This should not take too long.
          <br />
          {/* You might have to reauthorize this app's access to your twitter if the
          prompt shows <br /> */}
          Keep in mind, We do not see/track your twitter activities
        </Notification>
      </div>
    );
  }

  if (!taggedLoading) {
    return (
      <div className={classes.wrapper}>
        <>
          <BookmarksPageHeader />
        </>

        <section>
          {userData?.data === undefined ? (
            <div>Loading....</div>
          ) : (
            <SearchAndCreate
              length={userData?.data.length}
              info={`Tagged: ${userData?.data.length} tweets`}
              search={search}
              setSearch={setSearch}
              setOpenModal={setOpenModal}
              placeholder="Search through tagged with username/tags"
              value={value}
              setValue={setValue}
            />
          )}

          <CreateTagModal
            openModal={openModal}
            // tags={tags}
            // setTags={setTags}
            setOpenModal={setOpenModal}
          />
        </section>

        <main>
          <TaggedCards
            toSearch={toSearch}
            userData={userData}
            isTagError={isTagError}
            tagError={tagError}
          />
        </main>
      </div>
    );
  }

  return (
    <>
      <div>
        <p>
          Ooops, you were not supposed to see this 😳. Go back to homepage and
          retry
        </p>
      </div>
    </>
  );
};

export default Bookmarks;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const ID: string = session?.user.id;

  await queryClient.prefetchQuery(["tags", ID], async () => {
    await apiClient.get(`/tags/${ID}`);
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
