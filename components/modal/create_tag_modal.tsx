import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreate } from "../../utils/api/hooks/createTag";

interface CreateTagModalInterface {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

import { createStyles } from "@mantine/core";

export const createTagComponentStyle = createStyles((_params) => ({
  modal: {
    button: {
      marginTop: ".6rem",
    },
  },
}));

const CreateTagModal = ({
  openModal,
  setOpenModal,
}: CreateTagModalInterface) => {
  const { classes } = createTagComponentStyle();
  const [value, setValue] = useState<string>("");
  const createMutation = useCreate(toast);
  const { data: session } = useSession();
  const userId: string = session?.user?.id;

  const onTagClose = (): any => {
    setOpenModal(false);

    createMutation.mutate({
      tweepId: userId,
      userTags: value,
    });
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
