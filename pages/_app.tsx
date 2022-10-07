import { MantineProvider } from "@mantine/core";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { UtilityProvider } from "../utils/context";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head> */}
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
