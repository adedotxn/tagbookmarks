export interface BookMarkInterface {
  name: string;
  username: string;
  attachments: {
    media_keys: string[];
  };
  created_at: string;
  id: string;
  text: string;
  author_id: string;
}

export interface bookmarkContextInterface {
  activeBookmarks: BookMarkInterface[];
  setActiveBookmarks: React.Dispatch<React.SetStateAction<BookMarkInterface[]>>;
}
