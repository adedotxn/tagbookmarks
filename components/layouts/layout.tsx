import Head from "next/head";
import { ReactNode } from "react";
import styles from "./PrimaryLayout.module.css";

export interface ILayout {
  children: ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Primary Layout Example</title>
      </Head>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;
