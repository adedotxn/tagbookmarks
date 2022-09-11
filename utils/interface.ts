export interface BookMarkInterface {
  text: string;
  id: string;
  created_at: string;
  attachment: {
    media_keys: string[];
  };
  name: string;
  username: string;
  author_id: string;
}
