import { Select } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useTags } from "../utils/api/hooks/getAllUserTags";
import { getSelectTags } from "../utils/selectData";

function TagSelect({
  setValue,
  value,
}: {
  value?: string | null;
  setValue?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { data: session } = useSession();
  const userId = session !== undefined && session?.user.id;
  const { data: allTags, isLoading: tagsLoading } = useTags(userId);

  const retTags = !tagsLoading ? allTags?.data : [[]];
  const allUserTags: string[] = retTags[0];
  const selectTags = getSelectTags(allUserTags);
  const initial = [{ value: "loading", label: "loadingg" }];
  let dataForSelect = tagsLoading ? initial : selectTags;

  return (
    <Select
      label="Select tag to view"
      placeholder="all tagged"
      value={value}
      data={dataForSelect}
      onChange={setValue}
      allowDeselect
      maxDropdownHeight={280}
    />
  );
}

export default TagSelect;
