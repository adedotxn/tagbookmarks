import React, { createContext, useContext, useState } from "react";
import {
  allBookmarksContextInterface,
  bookmarkContextInterface,
  BookMarkInterface,
} from "./interface/context.interface";

const bookmarksContextDefaultValue: bookmarkContextInterface = {
  activeBookmarks: [],
  setActiveBookmarks: () => null,
};

const allBookmarksContextDefaultValue: allBookmarksContextInterface = {
  allBookmarks: [],
  setAllBookmarks: () => null,
};

export const BookmarkContext = createContext(bookmarksContextDefaultValue);
export const AllBookmarksContext = createContext(
  allBookmarksContextDefaultValue
);

export const useActiveBookmarks = () => {
  return useContext(BookmarkContext);
};

export const useAllBookmarksContextHook = () => {
  return useContext(AllBookmarksContext);
};

export const UtilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeBookmarks, setActiveBookmarks] = useState<BookMarkInterface[]>(
    []
  );
  const [allBookmarks, setAllBookmarks] = useState<BookMarkInterface[]>([]);

  return (
    <BookmarkContext.Provider
      value={{
        activeBookmarks,
        setActiveBookmarks,
      }}
    >
      <AllBookmarksContext.Provider
        value={{
          allBookmarks,
          setAllBookmarks,
        }}
      >
        {children}
      </AllBookmarksContext.Provider>
    </BookmarkContext.Provider>
  );
};
