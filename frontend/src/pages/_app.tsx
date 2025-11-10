import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import PopulatedNavBar from "../components/PopulatedNavBar";
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <PopulatedNavBar />
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}

export default MyApp;
