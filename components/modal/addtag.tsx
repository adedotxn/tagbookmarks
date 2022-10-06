import { Button, Group, Modal, MultiSelect } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useAddTag } from "../../utils/hooks/tag_A_Tweet";
import CreateTagModal from "./create_tag_modal";

export interface addTagInterface {
  tagId: string;
  setTagId: React.Dispatch<React.SetStateAction<string>>;
  dataId: string;
  userId: string;
  allTags: any;
  tagsLoading: boolean;
}

interface multiselectInterface {
  label: string;
  value: string;
}
const AddtagModal = ({
  userId,
  tagId,
  dataId,
  setTagId,
  allTags,
  tagsLoading,
}: addTagInterface): JSX.Element => {
  const [value, setValue] = useState<string[]>([]);
  const [openCreateTag, setOpenCreateTag] = useState<boolean>(false);

  const addTagMutation = useAddTag();

  // const { data: allTags, isLoading: tagsLoading } = useTags(userId);

  if (!tagsLoading && allTags?.data.length !== 0) {
    const retTags = !tagsLoading ? allTags?.data : [];
    const allUserTags: string[] = retTags[0];

    let filtered;
    let dataForMultiSelect: multiselectInterface[];

    if (allUserTags !== undefined) {
      filtered = allUserTags.filter((item) => item !== null || undefined);

      dataForMultiSelect = Array.isArray(filtered)
        ? filtered.map((e) => {
            return {
              value: e,
              label: e,
            };
          })
        : [];
    } else {
      dataForMultiSelect = [];
    }

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
          label="Select tag to add"
        />

        <Group position="center">
          <Button //*the dataId is the tweet id
            onClick={() => onTagClose(dataId)}
            variant="default"
          >
            Add Tag
          </Button>
        </Group>
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
