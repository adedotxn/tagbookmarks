import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { tagInterface } from "../pages/tagged";
import { useCreate } from "../utils/api/api-hooks";
import { bookmarkPageStyle } from "./styles/style";

interface CreateTagModalInterface {
  openModal: boolean;
  tags: tagInterface[];
  setTags: React.Dispatch<React.SetStateAction<tagInterface[]>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTagModal = ({
  openModal,
  tags,
  setTags,
  setOpenModal,
}: CreateTagModalInterface) => {
  const { classes } = bookmarkPageStyle();
  const [value, setValue] = useState<string>("");
  const createMutation = useCreate();
  const { data: session } = useSession();
  const userId: string = session?.user?.id;
  // console.log("userId", userId);

  const onTagClose = (): any => {
    setOpenModal(false);
    const toSave = tags.map((e) => e.value);
    console.log("value", toSave);

    createMutation.mutate({
      tweepId: userId,
      userTags: toSave,
    });
    console.log("done"), { toSave, userId };
  };
  return (
    <Modal
      padding={25}
      transition="slide-down"
      transitionDuration={300}
      transitionTimingFunction="ease"
      opened={openModal}
      className={classes.modal}
      onClose={() => setOpenModal(false)}
      closeButtonLabel="Close Create Tag Modal"
      title="Create tags to place on your bookmarked"
    >
      {/* <MultiSelect
        //   label="Create Tags to put on your bookmarks"
        description="Type in a new tag to add to your list of tags"
        data={tags}
        placeholder="e.g 'Tech Tweets'"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          const item = { value: query, label: query };
          setTags((current) => [...current, item]);
          return item;
        }}
      /> */}
      <TextInput
        label="Create Tags to put on your bookmarks"
        aria-label="Create Tags to put on your bookmarks"
        placeholder="e.g 'Tech Tweets'"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />

      <Group position="center">
        <Button onClick={onTagClose} variant="default">
          Create New Tag
        </Button>
      </Group>
    </Modal>
  );
};

export default CreateTagModal;