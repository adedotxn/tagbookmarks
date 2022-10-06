interface multiselectInterface {
  label: string;
  value: string;
}
export function getSelectTags(allUserTags: string[] | undefined) {
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

  return dataForMultiSelect;
}
