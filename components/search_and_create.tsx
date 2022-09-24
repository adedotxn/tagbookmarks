import { Button, Input, Text } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons";
import React, { ChangeEvent } from "react";
import { bookmarkPageStyle } from "./styles/style";

export interface SearchAndCreateInterface {
  info: string;
  length: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchAndCreate = ({
  info,
  length,
  search,
  setSearch,
  setOpenModal,
}: SearchAndCreateInterface) => {
  const { classes } = bookmarkPageStyle();

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
              placeholder="Search through tagged"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>

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
