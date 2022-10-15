import { Box, Burger, Button, Drawer, NavLink } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTwitter, IconHome, IconTag } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { headerStyle } from "../styles/header";

const BookmarksPageHeader = () => {
  /** States */
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const burgerTitle = openedDrawer ? "Close Sidebar" : "Open Sidebar";

  /**  Fetching / Getting */
  const { classes } = headerStyle();
  const matches = useMediaQuery("(min-width: 768px)", true, {
    getInitialValueInEffect: false,
  });
  const { pathname, push } = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <header className={classes.header}>
        {!pathname.includes("tagged") && matches && (
          <div className={classes.avi}>
            <Button
              color="gray"
              variant="default"
              compact
              onClick={() => push("/tagged")}
            >
              View tagged bookmark-tweets
            </Button>
          </div>
        )}

        {!matches && (
          <div className={classes.avi}>
            <Burger
              opened={openedDrawer}
              onClick={() => setOpenedDrawer(true)}
              title={burgerTitle}
            />
          </div>
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
                active={pathname === "/"}
              />
            </Link>
            <Link href={`bookmarks/${session?.user?.name}`} passHref>
              <NavLink
                icon={<IconBrandTwitter />}
                variant="light"
                label="Twitter bookmarks page"
                color="blue"
                active={pathname === `/test`}
              />
            </Link>
            <Link href="/tagged" passHref>
              <NavLink
                icon={<IconTag />}
                variant="light"
                label="View tagged bookmark-tweets"
                color="gray"
                active={pathname === "/tagged"}
              />
            </Link>
          </Box>
        </Drawer>

        <h1>tagBookmarks</h1>

        {matches && (
          <div>
            <Button
              onClick={() => push("/")}
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
