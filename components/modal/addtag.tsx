import { Button, Group, Modal, MultiSelect } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddTag } from "../../utils/api/hooks/tag_A_Tweet";
import { getSelectTags } from "../../utils/selectData";
import CreateTagModal from "./create_tag_modal";

export interface addTagInterface {
  tagId: string;
  setTagId: React.Dispatch<React.SetStateAction<string>>;
  dataId: string;
  userId: string;
  allTags: any;
  tagsLoading: boolean;
  isTagError: boolean;
  tagError?: unknown;
}

const AddtagModal = ({
  userId,
  tagId,
  dataId,
  setTagId,
  allTags,
  tagsLoading,
  isTagError,
}: addTagInterface): JSX.Element => {
  const [value, setValue] = useState<string[]>([]);
  const [openCreateTag, setOpenCreateTag] = useState<boolean>(false);

  const addTagMutation = useAddTag(toast);

  if (!tagsLoading && allTags?.data.length !== 0 && !isTagError) {
    const retTags = !tagsLoading ? allTags?.data : [[]];
    const allUserTags: string[] = retTags[0];

    const dataForMultiSelect = getSelectTags(allUserTags);

    const onTagClose = (id: string) => {
      setTagId("shagabum");

      addTagMutation.mutate({
        tweepId: userId,
        tweetId: id,
        tags: value,
      });
    };

    return (
      <Modal
        opened={tagId === dataId}
        onClose={() => setTagId("shagabum")}
        title="Select a tag"
      >
        <MultiSelect
          value={value}
          onChange={setValue}
          data={dataForMultiSelect}
          label="Select tag to pin on tweet"
        />

        <Group position="center" mt={10}>
          <Button //*the dataId is the tweet id
            onClick={() => onTagClose(dataId)}
            variant="default"
          >
            Add Tag
          </Button>

          <Button variant="default" onClick={() => setOpenCreateTag(true)}>
            Create New Tag
          </Button>
        </Group>

        <CreateTagModal
          openModal={openCreateTag}
          setOpenModal={setOpenCreateTag}
        />
      </Modal>
    );
  }

  return (
    <div>
      <Modal
        opened={tagId === dataId}
        onClose={() => setTagId("shagabum")}
        title="You have no tags created yet"
      >
        <div>
          <Button
            mt={10}
            onClick={() => setOpenCreateTag(true)}
            variant="default"
            leftIcon={<IconPlus />}
          >
            Create Tag
          </Button>

          <CreateTagModal
            openModal={openCreateTag}
            setOpenModal={setOpenCreateTag}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AddtagModal;
