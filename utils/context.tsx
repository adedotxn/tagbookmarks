import React, { createContext, useContext, useState } from "react";
import {
  bookmarkContextInterface,
  BookMarkInterface,
} from "./interface/context.interface";

const bookmarksContextDefaultValue: bookmarkContextInterface = {
  activeBookmarks: [],
  setActiveBookmarks: () => null,
};

export const BookmarkContext = createContext(bookmarksContextDefaultValue);

export const useActiveBookmarks = () => {
  return useContext(BookmarkContext);
};

export const UtilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeBookmarks, setActiveBookmarks] = useState<BookMarkInterface[]>(
    []
  );

  return (
    <BookmarkContext.Provider value={{ activeBookmarks, setActiveBookmarks }}>
      {children}
    </BookmarkContext.Provider>
  );
};
