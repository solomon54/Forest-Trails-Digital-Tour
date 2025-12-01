import '@/styles/globals.css';
import { Poppins } from "next/font/google";
import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import type { AppProps } from "next/app";

<Head>
  <title>Discover Ethiopia’s Hidden Trails | Premium Tours</title>
  <meta name="description" content="Explore Ethiopia's hidden trails with premium guided tours. Book your adventure today!" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta property="og:title" content="Discover Ethiopia’s Hidden Trails" />
  <meta property="og:description" content="Explore Ethiopia's hidden trails with premium guided tours." />
  <meta property="og:image" content="/images/hero.jpg" />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/favicon.ico" />
</Head>




const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  
  
});
  export default function App({ Component, pageProps }: AppProps)  {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
