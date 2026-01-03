// pages/_app.tsx
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "@/store";
import PWARegister from "@/components/PWARegister";
import InstallPWA from "@/components/InstallPWA";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {" "}
      {/* The 'Provider' is required to fix your Redux build error */}
      <Head>
        <title>Forest·Trails Ethiopia | Authentic Eco Adventures</title>
        <meta
          name="description"
          content="Discover Ethiopia's hidden church forests..."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* CRITICAL FOR PWA INSTALL */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Social - Kept all your metadata */}
        <meta property="og:title" content="Forest·Trails Ethiopia" />
        <meta property="og:description" content="Authentic eco-tours..." />
        <meta property="og:image" content="/images/hero.jpg" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PWARegister />
      <InstallPWA />
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
