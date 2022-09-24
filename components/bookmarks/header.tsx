import { Box, Burger, Button, Drawer, NavLink } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTwitter, IconHome, IconTag } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { bookmarkPageStyle } from "../styles/style";

const BookmarksPageHeader = () => {
  const { classes } = bookmarkPageStyle();
  const matches = useMediaQuery("(min-width: 768px)", true, {
    getInitialValueInEffect: false,
  });
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const router = useRouter();
  const burgerTitle = openedDrawer ? "Close Sidebar" : "Open Sidebar";

  return (
    <>
      <header className={classes.header}>
        <div className={classes.avi}>
          {matches ? (
            <Button
              // mt={20}
              component="a"
              target="_blank"
              variant="default"
              color="gray"
              compact
            >
              View tagged bookmark-tweets
            </Button>
          ) : (
            <>
              <Burger
                opened={openedDrawer}
                onClick={() => setOpenedDrawer(true)}
                title={burgerTitle}
              />
            </>
          )}

          <Drawer
            size="sm"
            position="bottom"
            opened={openedDrawer}
            onClose={() => setOpenedDrawer(false)}
          >
            <Box>
              <Link href="/" passHref>
                <NavLink
                  icon={<IconHome />}
                  variant="light"
                  label="Go back to homepage"
                  color="gray"
                  active={router.pathname === "/"}
                />
              </Link>
              <Link href={`bookmarks${router.query}`} passHref>
                <NavLink
                  icon={<IconBrandTwitter />}
                  variant="light"
                  label="Twitter bookmarks page"
                  color="blue"
                  active={router.pathname === `/test`}
                />
              </Link>
              <Link href="/tagged" passHref>
                <NavLink
                  icon={<IconTag />}
                  variant="light"
                  label="View tagged bookmark-tweets"
                  color="gray"
                  active={router.pathname === "/tagged"}
                />
              </Link>
            </Box>
          </Drawer>
        </div>

        <h1>Bkmrked</h1>

        {matches && (
          <div>
            <Button
              // mt={20}
              component="a"
              target="_blank"
              variant="default"
              color="gray"
              compact
            >
              Back to homepage
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default BookmarksPageHeader;
