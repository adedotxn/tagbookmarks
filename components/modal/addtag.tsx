import { Button, Group, Modal, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { useTags } from "../../utils/api/hooks/alltags";
import { useAddTag } from "../../utils/api/hooks/tag_tweet";

export interface addTagInterface {
  tagId: string;
  setTagId: React.Dispatch<React.SetStateAction<string>>;
  dataId: string;
  userId: string;
}
const AddtagModal = ({
  userId,
  tagId,
  dataId,
  setTagId,
}: addTagInterface): JSX.Element => {
  const [value, setValue] = useState<string[]>([]);
  const addTagMutation = useAddTag();

  const { data: allTags, isLoading: tagsLoading } = useTags(userId);

  if (!tagsLoading) {
    const retTags = !tagsLoading ? allTags?.data : [];
    const allUserTags: string[] = retTags[0];
    const filtered = allUserTags.filter((item) => item !== null || undefined);
    const dataForMultiSelect = Array.isArray(filtered)
      ? filtered.map((e) => {
          return {
            value: e,
            label: e,
          };
        })
      : [];

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
      <h2>Loading..</h2>
    </div>
  );
};

export default AddtagModal;
