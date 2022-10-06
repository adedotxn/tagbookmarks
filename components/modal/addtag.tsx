import { Button, Group, Modal, MultiSelect, Text } from "@mantine/core";
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

  if (!tagsLoading) {
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
        {dataForMultiSelect.length === 0 ? (
          <div>
            <Text> Create tags first boss</Text>
            <CreateTagModal
              openModal={openCreateTag}
              setOpenModal={setOpenCreateTag}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </Modal>
    );
  }

  return (
    <div>
      <span>.</span>
    </div>
  );
};

export default AddtagModal;
