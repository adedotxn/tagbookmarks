import { Button, Input, Text } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons";
import { useRouter } from "next/router";
import React, { ChangeEvent } from "react";
import { searchCreateComponentStyle } from "./styles/search&Create";
import TagSelect from "./tagSelect";

export interface SearchAndCreateInterface {
  info: string;
  length: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
  value?: string | null;
  setValue?: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchAndCreate = ({
  info,
  length,
  search,
  setSearch,
  setOpenModal,
  placeholder,
  setValue,
  value,
}: SearchAndCreateInterface) => {
  const { classes } = searchCreateComponentStyle();
  const { pathname } = useRouter();

  return (
    <>
      {length !== 0 && (
        <section className={classes.mid_section}>
          <div className={classes.search}>
            <Text align="left" weight={600}>
              {info}
            </Text>
            <Input
              icon={<IconSearch />}
              variant="filled"
              placeholder={placeholder}
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {pathname.includes("tagged") && (
            <div className={classes.tagSelect}>
              <TagSelect value={value} setValue={setValue} />
            </div>
          )}

          <div>
            <Button
              mt={10}
              onClick={() => setOpenModal(true)}
              variant="default"
              leftIcon={<IconPlus />}
            >
              Create Tag
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default SearchAndCreate;
