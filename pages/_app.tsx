import { MantineProvider } from "@mantine/core";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { UtilityProvider } from "../utils/context";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <UtilityProvider>
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  fontFamily: "Kanit, Verdana, sans-serif",
                  spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
                  breakpoints: { md: 768, lg: 1024 },
                  colorScheme: "dark",
                  loader: "bars",
                }}
              >
                <Head>
                  <title>TagBookmarks </title>
                  <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                  />
                  <meta property="og:type" content="website" />
                  <meta property="og:title" content="TagBookmarks" />
                  <meta
                    property="og:description"
                    content="Web app to pin tags/labels to your twitter bookmarks"
                  />
                  <meta property="og:site_name" content="tagBookmarks" />
                  <meta
                    property="og:url"
                    content="https://tagbookmarks.vercel.app"
                  />
                </Head>
                <Toaster />
                <Component {...pageProps} />
              </MantineProvider>
            </UtilityProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
